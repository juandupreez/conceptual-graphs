import { Concept, DesignatorType, Referent } from "../../domain/Concept";
import { ConceptType } from "../../domain/ConceptType";
import { cloneConcept } from "../../util/ConceptUtil";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { ConceptTypeDao, NoSuchConceptTypeError } from "../ConceptTypeDao";
import { Store } from "./store/Store";

export class InMemoryConceptDao implements ConceptDao {
    conceptTypeDao: ConceptTypeDao;
    concepts: Concept[] = Store.getInstance().state.concepts;

    constructor(conceptTypeDao: ConceptTypeDao) {
        this.conceptTypeDao = conceptTypeDao;
    }

    createConcept(newConceptLabel: string, conceptTypeLabels: string[], referent?: string | Referent): Concept {
        this._validateConceptBeforeCreate(newConceptLabel, conceptTypeLabels, referent);
        const newConcept: Concept = new Concept();
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptId();
        newConcept.id = generatedId;
        newConcept.label = newConceptLabel;
        newConcept.conceptTypeLabels = conceptTypeLabels;
        if (!referent) {
            newConcept.referent = {
                designatorType: DesignatorType.BLANK,
                designatorValue: undefined
            };
        } else if (typeof referent === 'string') {
            newConcept.referent = {
                designatorType: DesignatorType.LITERAL,
                designatorValue: referent
            }
        } else {
            newConcept.referent = {
                designatorType: referent.designatorType,
                designatorValue: referent.designatorValue
            };
        }
        this.concepts.push(newConcept);
        return cloneConcept(newConcept);
    }

    _validateConceptBeforeCreate(newConceptLabel: string, conceptTypeLabels: string[], referent: string | Referent) {
        if (conceptTypeLabels) {
            conceptTypeLabels.forEach((singleConceptTypeLabel) => {
                if (!this.conceptTypeDao.getConceptTypeByLabel(singleConceptTypeLabel)) {
                    throw new NoSuchConceptTypeError('Cannot create concept type with label: ' + newConceptLabel + ". Concept Type '"
                        + singleConceptTypeLabel + "' does not exist");
                }
            })
        }
        if (!conceptTypeLabels || conceptTypeLabels.length === 0) {
            throw new Error('Cannot create concept type with label: ' + newConceptLabel + ". Needs at least one concept type");
        }
        if (this.getConceptByLabel(newConceptLabel)) {
            throw new Error('Cannot create concept type with label: ' + newConceptLabel + ". A concept with that label already exists");
        }
    }

    getConceptById(conceptIdToFind: string): Concept {
        return cloneConcept(this.concepts.find((singleConcept) => {
            return (singleConcept.id
                && singleConcept.id === conceptIdToFind);
        }))
    }

    getConceptByLabel(conceptLabel: string): Concept {
        return this.concepts.find((singleConcept) => {
            return (singleConcept.id
                && singleConcept.label === conceptLabel)
        })
    }

    getConceptsByExample(conceptToMatch: Concept) {
        // A concept matches when it has concept types equal to or lower than the concept to match's concept types
        const possibleConceptTypeLabels: string[] = this._getAllSubConceptTypes(conceptToMatch.conceptTypeLabels);
        return this.concepts.filter((singleConcept) => {
            let doesConceptMatch: boolean = false;
            let doConceptTypesMatch: boolean = this._isSetOneASubsetOfSetTwo(singleConcept.conceptTypeLabels, possibleConceptTypeLabels);
            if (conceptToMatch.referent?.designatorType === DesignatorType.LAMBDA && doConceptTypesMatch) {
                doesConceptMatch = true;
            } else if (doConceptTypesMatch
                && conceptToMatch.referent.designatorType === singleConcept.referent.designatorType
                && conceptToMatch.referent.designatorValue === singleConcept.referent.designatorValue) {
                doesConceptMatch = true;
            }
            return doesConceptMatch;
        })
    }

    private _getAllSubConceptTypes(conceptTypeLabels: string[]): string[] {
        return conceptTypeLabels.reduce((accumulator: string[], singleConceptTypeLabel) => {
            accumulator.push(...this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(singleConceptTypeLabel));
            return accumulator;
        }, []);
    }

    private _isSetOneASubsetOfSetTwo(setA: string[], setB: string[]): boolean {
        let isASubset: boolean = true;
        for (let i = 0; i < setA.length; i++) {
            const singeElement = setA[i];
            if (!setB.includes(singeElement)) {
                isASubset = false;
                break;
            }
        }
        return isASubset;
    }

    updateConcept(conceptToUpdate: Concept): Concept {
        this._validateConceptBeforeUpdate(conceptToUpdate);
        this.concepts.forEach((singleConcept) => {
            if (singleConcept.id
                && conceptToUpdate.id
                && singleConcept.id === conceptToUpdate.id) {
                singleConcept.referent = conceptToUpdate.referent;
                singleConcept.label = conceptToUpdate.label;
            }
            if (singleConcept.id
                && conceptToUpdate.id
                && singleConcept.id === conceptToUpdate.id
                && singleConcept.label === conceptToUpdate.label) {
                singleConcept.referent = conceptToUpdate.referent;
                singleConcept.label = conceptToUpdate.label;
            }
        })
        return cloneConcept(conceptToUpdate);
    }

    _validateConceptBeforeUpdate(conceptToUpdate: Concept): void {
        if (!conceptToUpdate.conceptTypeLabels || conceptToUpdate.conceptTypeLabels.length === 0) {
            throw new Error('Could not update concept with label: '
                + conceptToUpdate.label
                + '. A concept must have at least one concept type');
        }
        if (conceptToUpdate && conceptToUpdate.conceptTypeLabels) {
            conceptToUpdate.conceptTypeLabels.forEach((singleConceptTypeLabel) => {
                const conceptType: ConceptType = this.conceptTypeDao.getConceptTypeByLabel(singleConceptTypeLabel);
                if (!conceptType) {
                    throw new NoSuchConceptTypeError('Could not update concept with label: '
                        + conceptToUpdate.label + '. No concept type label: '
                        + singleConceptTypeLabel);
                }
            })
        }
        if (conceptToUpdate.id) {
            const possibleExistingConcept: Concept = this.getConceptByLabel(conceptToUpdate.label);
            if (possibleExistingConcept && possibleExistingConcept.id !== conceptToUpdate.id) {
                throw new Error('Could not update concept with label: '
                    + conceptToUpdate.label
                    + '. Another concept with that label already exists for this conceptual graph. It has id: '
                    + possibleExistingConcept.id);
            }
        }
    }

    deleteConcept(idToDelete: string): boolean {
        let isSuccessfulDelete: boolean = false;
        const lengthBeforeDelete: number = this.concepts.length;
        this.concepts = this.concepts.filter((singleConcpet) => {
            return (singleConcpet.id !== idToDelete);
        })
        if (this.concepts.length !== lengthBeforeDelete) {
            isSuccessfulDelete = true;
        }
        return isSuccessfulDelete;
    }

}