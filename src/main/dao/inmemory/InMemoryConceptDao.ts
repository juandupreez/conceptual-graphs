import { Concept, ConceptId } from "../../domain/Concept";
import { ConceptType } from "../../domain/ConceptType";
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

    createConcept(conceptualGraphId: string, newConceptLabel: string, conceptTypeLabels: string[], referent: string): Concept {
        this._validateConceptBeforeCreate(conceptualGraphId, newConceptLabel, conceptTypeLabels, referent);
        const newConcept: Concept = new Concept();
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptId();
        if (!newConcept.id) {
            newConcept.id = {
                conceptId: null,
                conceptualGraphId: conceptualGraphId
            }
        }
        newConcept.id.conceptId = generatedId;
        newConcept.label = newConceptLabel;
        newConcept.conceptTypeLabels = conceptTypeLabels;
        newConcept.referent = referent;
        this.concepts.push(newConcept);
        return this._clone(newConcept);
    }

    _validateConceptBeforeCreate(conceptualGraphId: string, newConceptLabel: string, conceptTypeLabels: string[], referent: string) {
        if (!conceptualGraphId) {
            throw new Error('Cannot create concept type with label: ' + newConceptLabel + ". A conceptual graph must exist and id must be provided");
        }
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
        if (this.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, newConceptLabel)) {
            throw new Error('Cannot create concept type with label: ' + newConceptLabel + ". A concept with that label already exists for conceptual graph with id: " + conceptualGraphId);
        }
    }

    getConceptById(conceptIdToFind: ConceptId): Concept {
        return this._clone(this.concepts.find((singleConcept) => {
            return (singleConcept.id
                && singleConcept.id.conceptId === conceptIdToFind.conceptId
                && singleConcept.id.conceptualGraphId === conceptIdToFind.conceptualGraphId);
        }))
    }

    getConceptByConceptualGraphIdAndLabel(conceptualGraphId: string, conceptLabel: string): Concept {
        return this.concepts.find((singleConcept) => {
            return (singleConcept.id
                && singleConcept.id.conceptualGraphId === conceptualGraphId
                && singleConcept.label === conceptLabel)
        })
    }

    updateConcept(conceptToUpdate: Concept): Concept {
        this._validateConceptBeforeUpdate(conceptToUpdate);
        this.concepts.forEach((singleConcept) => {
            if (singleConcept.id
                && conceptToUpdate.id
                && singleConcept.id.conceptId === conceptToUpdate.id.conceptId
                && singleConcept.id.conceptualGraphId === conceptToUpdate.id.conceptualGraphId) {
                singleConcept.referent = conceptToUpdate.referent;
                singleConcept.label = conceptToUpdate.label;
            }
            if (singleConcept.id
                && conceptToUpdate.id
                && singleConcept.id.conceptId === conceptToUpdate.id.conceptId
                && singleConcept.label === conceptToUpdate.label) {
                singleConcept.id.conceptualGraphId = conceptToUpdate.id.conceptualGraphId;
                singleConcept.referent = conceptToUpdate.referent;
                singleConcept.label = conceptToUpdate.label;
            }
        })
        return this._clone(conceptToUpdate);
    }

    _validateConceptBeforeUpdate(conceptToUpdate: Concept): void {
        if (!conceptToUpdate || !conceptToUpdate.id || !conceptToUpdate.id.conceptualGraphId) {
            throw new Error('Could not update concept with label: '
                + conceptToUpdate.label
                + '. A concept must have conceptual graph id');
        }
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
            const possibleExistingConcept: Concept = this.getConceptByConceptualGraphIdAndLabel(conceptToUpdate.id.conceptualGraphId, conceptToUpdate.label);
            if (possibleExistingConcept && possibleExistingConcept.id.conceptId !== conceptToUpdate.id.conceptId) {
                throw new Error('Could not update concept with label: '
                    + conceptToUpdate.label
                    + '. Another concept with that label already exists for this conceptual graph. It has id: '
                    + possibleExistingConcept.id.conceptId);
            }
        }
    }

    deleteConcept(idToDelete: ConceptId): boolean {
        let isSuccessfulDelete: boolean = false;
        const lengthBeforeDelete: number = this.concepts.length;
        this.concepts = this.concepts.filter((singleConcpet) => {
            return (singleConcpet.id.conceptId !== idToDelete.conceptId
                && singleConcpet.id.conceptualGraphId !== idToDelete.conceptualGraphId);
        })
        if (this.concepts.length !== lengthBeforeDelete) {
            isSuccessfulDelete = true;
        }
        return isSuccessfulDelete;
    }

    _clone(conceptToClone: Concept): Concept {
        return conceptToClone ? {
            ...conceptToClone,
            id: {
                ...conceptToClone.id
            },
            conceptTypeLabels: [...conceptToClone.conceptTypeLabels]
        } : conceptToClone;
    }

}