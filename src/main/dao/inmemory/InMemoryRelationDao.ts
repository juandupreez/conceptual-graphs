import { Concept, DesignatorType } from "../../domain/Concept";
import { ConceptualGraph } from "../../domain/ConceptualGraph";
import { Relation } from "../../domain/Relation";
import { RelationType } from "../../domain/RelationType";
import { hasAnyConceptTypes } from "../../util/ConceptUtil";
import { IdGenerator } from "../../util/IdGenerator";
import { cloneRelation } from "../../util/RelationUtil";
import { ConceptDao } from "../ConceptDao";
import { ConceptTypeDao } from "../ConceptTypeDao";
import { RelationDao } from "../RelationDao";
import { RelationTypeDao, NoSuchRelationTypeError } from "../RelationTypeDao";
import { Store } from "./store/Store";

export class InMemoryRelationDao implements RelationDao {
    conceptDao: ConceptDao;
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    relations: Relation[] = Store.getInstance().state.relations;

    constructor(conceptDao: ConceptDao, conceptTypeDao: ConceptTypeDao, relationTypeDao: RelationTypeDao) {
        this.conceptDao = conceptDao;
        this.conceptTypeDao = conceptTypeDao;
        this.relationTypeDao = relationTypeDao;
    }

    createRelation(newRelationLabel: string, relationTypeLabels: string[], conceptArgumentLabels: string[]): Relation {
        this._validateRelationBeforeCreate(newRelationLabel, relationTypeLabels, conceptArgumentLabels);
        const newRelation: Relation = new Relation();
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationId();
        newRelation.id = generatedId;
        newRelation.label = newRelationLabel;
        newRelation.relationTypeLabels = relationTypeLabels;
        newRelation.conceptArgumentLabels = conceptArgumentLabels;
        this.relations.push(newRelation);
        return cloneRelation(newRelation);
    }

    _validateRelationBeforeCreate(newRelationLabel: string, relationTypeLabels: string[], conceptArgumentLabels: string[]) {
        if (relationTypeLabels) {
            relationTypeLabels.forEach((singleRelationTypeLabel) => {
                if (!this.relationTypeDao.getRelationTypeByLabel(singleRelationTypeLabel)) {
                    throw new NoSuchRelationTypeError('Cannot create relation with label: ' + newRelationLabel + ". Relation Type '"
                        + singleRelationTypeLabel + "' does not exist");
                }
            })
        }
        if (conceptArgumentLabels) {
            conceptArgumentLabels.forEach((singleConceptArgumentLabel) => {
                const concept: Concept = this.conceptDao.getConceptByLabel(singleConceptArgumentLabel);
                if (!concept) {
                    throw new Error('Cannot create relation with label: '
                        + newRelationLabel + ". Concept given as argument ("
                        + singleConceptArgumentLabel + ") does not exist");
                }
            })
        }
        if (!relationTypeLabels || relationTypeLabels.length === 0) {
            throw new Error('Cannot create relation with label: ' + newRelationLabel + ". Needs at least one relation type");
        }
        if (this.getRelationByLabel(newRelationLabel)) {
            throw new Error('Cannot create relation with label: ' + newRelationLabel + ". A relation with that label already exists");
        }
        if (relationTypeLabels && relationTypeLabels.length > 0) {
            const firstRelationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(relationTypeLabels[0]);
            if (firstRelationType.signature.length !== conceptArgumentLabels.length) {
                throw new Error('Cannot create relation with label: '
                    + newRelationLabel + ". Number of concept arguments ("
                    + conceptArgumentLabels.length + ") does not match number of concept types in relation type signature ("
                    + firstRelationType.signature.length + ")");
            }
        }
        if (conceptArgumentLabels) {
            let doesMatchAnySignature: boolean = false;
            const coneptArguments: Concept[] = conceptArgumentLabels.map((singleConceptArgumentLabel) => {
                return this.conceptDao.getConceptByLabel(singleConceptArgumentLabel);
            })
            for (let i = 0; i < relationTypeLabels.length && doesMatchAnySignature === false; i++) {
                const relationTypeLabel = relationTypeLabels[i];
                const singleRelationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(relationTypeLabel);
                doesMatchAnySignature = doesMatchAnySignature || this._doesConceptArgumentsMatchRelationTypeSignature(coneptArguments, singleRelationType);
            }
            if (!doesMatchAnySignature) {
                throw new Error('Cannot create relation with label: '
                    + newRelationLabel + ". Argument concept types of arguments ("
                    + conceptArgumentLabels
                    + ") do not match any signatures of relation types: "
                    + relationTypeLabels);
            }
        }
    }

    _doesConceptArgumentsMatchRelationTypeSignature(conceptArguments: Concept[], relationType: RelationType): boolean {
        let doesMatchAllInSignature: boolean = true;
        relationType.signature.forEach((singleSignatureConceptTypeLabel, signatureIndex) => {
            const possibleConceptTypeLabels: string[]
                = this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(singleSignatureConceptTypeLabel);
            doesMatchAllInSignature = doesMatchAllInSignature
                && conceptArguments[signatureIndex]
                && hasAnyConceptTypes(conceptArguments[signatureIndex], possibleConceptTypeLabels);
        })
        return doesMatchAllInSignature;
    }

    getRelationById(relationIdToFind: string): Relation {
        return cloneRelation(this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.id === relationIdToFind);
        }))
    }

    getRelationByLabel(relationLabel: string): Relation {
        return cloneRelation(this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.label === relationLabel)
        }))
    }

    getRelationsByExample(relationToMatch: Relation, query?: ConceptualGraph) {
        // A relation matches when it has relation types equal to or lower than the relation to match's relation types
        const possibleRelationTypeLabels: string[] = this._getAllSubRelationTypes(relationToMatch.relationTypeLabels);
        return this.relations.filter((singleRelation) => {
            let doesRelationMatch: boolean = false;
            let doConceptsMatch: boolean = query ? this._doConceptsMatch(relationToMatch.conceptArgumentLabels, singleRelation.conceptArgumentLabels, query) : true;
            let doAllRelationTypesMatchSignature: boolean = this._isSetOneASubsetOfSetTwo(singleRelation.relationTypeLabels, possibleRelationTypeLabels);
            if (doAllRelationTypesMatchSignature && doConceptsMatch) {
                doesRelationMatch = true;
            }
            return doesRelationMatch;
        })
    }

    private _getAllSubRelationTypes(relationTypeLabels: string[]): string[] {
        return relationTypeLabels.reduce((accumulator: string[], singleRelationTypeLabel) => {
            accumulator.push(...this.relationTypeDao.getLabelAndAllSubLabelsOfRelation(singleRelationTypeLabel));
            return accumulator;
        }, []);
    }

    private _doConceptsMatch(conceptArgumentLabelsToMatch: string[], conceptArgumentLabels: string[], query: ConceptualGraph): boolean {
        if (!query) {
            return true;
        } else if (conceptArgumentLabelsToMatch?.length !== conceptArgumentLabels?.length) {
            return false;
        } else {
            let doAllConceptsMatch: boolean = true;
            conceptArgumentLabelsToMatch?.forEach((singleConceptLabelToMatch, index) => {
                const conceptToMatch: Concept = query.getConceptByLabel(singleConceptLabelToMatch);
                const potentialConcept: Concept = this.conceptDao.getConceptByLabel(conceptArgumentLabels[index]);
                const possibleConceptTypeLabels: string[] = this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(conceptToMatch.conceptTypeLabels);
                const potentialConceptTypeLabels: string[] = potentialConcept?.conceptTypeLabels ?? [];
                const doConceptTypesMatch: boolean = doAllConceptsMatch && this._isSetOneASubsetOfSetTwo(potentialConceptTypeLabels, possibleConceptTypeLabels);

                if (conceptToMatch.referent?.designatorType === DesignatorType.LAMBDA && doConceptTypesMatch) {
                    doAllConceptsMatch = doAllConceptsMatch && true;
                } else if (doConceptTypesMatch
                    && conceptToMatch.referent.designatorType === potentialConcept.referent.designatorType
                    && conceptToMatch.referent.designatorValue === potentialConcept.referent.designatorValue) {
                    doAllConceptsMatch = doAllConceptsMatch && true;
                } else {
                    doAllConceptsMatch = false
                }

            })
            return doAllConceptsMatch;
        }
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

    updateRelation(relationToUpdate: Relation): Relation {
        this._validateRelationBeforeUpdate(relationToUpdate);
        let didUpdateById: boolean = false;
        this.relations.forEach((singleRelation) => {
            if (singleRelation.id
                && relationToUpdate.id
                && singleRelation.id === relationToUpdate.id) {
                singleRelation.conceptArgumentLabels = relationToUpdate.conceptArgumentLabels;
                singleRelation.label = relationToUpdate.label;
                didUpdateById = true;
            }
        })
        if (!didUpdateById) { // then try updated by label
            this.relations.forEach((singleRelation) => {
                if (singleRelation.label === relationToUpdate.label) {
                    singleRelation.conceptArgumentLabels = relationToUpdate.conceptArgumentLabels;
                    relationToUpdate.id = singleRelation.id;
                }
            })
        }
        return cloneRelation(relationToUpdate);
    }

    _validateRelationBeforeUpdate(relationToUpdate: Relation): void {
        if (!relationToUpdate.relationTypeLabels || relationToUpdate.relationTypeLabels.length === 0) {
            throw new Error('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have at least one relation type');
        }
        if (relationToUpdate.conceptArgumentLabels) {
            relationToUpdate.conceptArgumentLabels.forEach((singleConceptArgumentLabel) => {
                const concept: Concept = this.conceptDao.getConceptByLabel(singleConceptArgumentLabel);
                if (!concept) {
                    throw new Error('Cannot update relation with label: '
                        + relationToUpdate.label + ". Concept given as argument ("
                        + singleConceptArgumentLabel + ") does not exist");
                }
            })
        }
        if (relationToUpdate && relationToUpdate.relationTypeLabels) {
            relationToUpdate.relationTypeLabels.forEach((singleRelationTypeLabel) => {
                const relationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(singleRelationTypeLabel);
                if (!relationType) {
                    throw new NoSuchRelationTypeError('Could not update relation with label: '
                        + relationToUpdate.label + '. No relation type label: '
                        + singleRelationTypeLabel);
                }
            })
        }
        if (relationToUpdate.id) {
            const possibleExistingRelation: Relation = this.getRelationByLabel(relationToUpdate.label);
            if (possibleExistingRelation && possibleExistingRelation.id !== relationToUpdate.id) {
                throw new Error('Could not update relation with label: '
                    + relationToUpdate.label
                    + '. Another relation with that label already exists for this conceptual graph. It has id: '
                    + possibleExistingRelation.id);
            }
        }
        if (relationToUpdate.relationTypeLabels && relationToUpdate.relationTypeLabels.length > 0) {
            const firstRelationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(relationToUpdate.relationTypeLabels[0]);
            if (firstRelationType.signature.length !== relationToUpdate.conceptArgumentLabels.length) {
                throw new Error('Cannot update relation with label: '
                    + relationToUpdate.label + ". Number of concept arguments ("
                    + relationToUpdate.conceptArgumentLabels.length + ") does not match number of concept types in relation type signature ("
                    + firstRelationType.signature.length + ")");
            }
        }
        if (relationToUpdate.conceptArgumentLabels) {
            let doesMatchAnySignature: boolean = false;
            const coneptArguments: Concept[] = relationToUpdate.conceptArgumentLabels.map((singleConceptArgumentLabel) => {
                return this.conceptDao.getConceptByLabel(singleConceptArgumentLabel);
            })
            for (let i = 0; i < relationToUpdate.relationTypeLabels.length && doesMatchAnySignature === false; i++) {
                const relationTypeLabel = relationToUpdate.relationTypeLabels[i];
                const singleRelationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(relationTypeLabel);
                doesMatchAnySignature = doesMatchAnySignature || this._doesConceptArgumentsMatchRelationTypeSignature(coneptArguments, singleRelationType);
            }
            if (!doesMatchAnySignature) {
                throw new Error('Cannot update relation with label: '
                    + relationToUpdate.label + ". Argument concept types of arguments ("
                    + relationToUpdate.conceptArgumentLabels
                    + ") do not match any signatures of relation types: "
                    + relationToUpdate.relationTypeLabels);
            }
        }
    }

    deleteRelation(idToDelete: string): boolean {
        let isSuccessfulDelete: boolean = false;
        const lengthBeforeDelete: number = this.relations.length;
        this.relations = this.relations.filter((singleConcpet) => {
            return (singleConcpet.id !== idToDelete);
        })
        if (this.relations.length !== lengthBeforeDelete) {
            isSuccessfulDelete = true;
        }
        return isSuccessfulDelete;
    }

}