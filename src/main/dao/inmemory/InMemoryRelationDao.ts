import { Concept } from "../../domain/Concept";
import { Relation, RelationId } from "../../domain/Relation";
import { RelationType } from "../../domain/RelationType";
import { ConceptUtil } from "../../util/ConceptUtil";
import { IdGenerator } from "../../util/IdGenerator";
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

    createRelation(conceptualGraphId: string, newRelationLabel: string, relationTypeLabels: string[], conceptArgumentLabels: string[]): Relation {
        this._validateRelationBeforeCreate(conceptualGraphId, newRelationLabel, relationTypeLabels, conceptArgumentLabels);
        const newRelation: Relation = new Relation();
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationId();
        if (!newRelation.id) {
            newRelation.id = {
                relationId: null,
                conceptualGraphId: conceptualGraphId
            }
        }
        newRelation.id.relationId = generatedId;
        newRelation.label = newRelationLabel;
        newRelation.relationTypeLabels = relationTypeLabels;
        newRelation.conceptArgumentLabels = conceptArgumentLabels;
        this.relations.push(newRelation);
        return this._clone(newRelation);
    }

    _validateRelationBeforeCreate(conceptualGraphId: string, newRelationLabel: string, relationTypeLabels: string[], conceptArgumentLabels: string[]) {
        if (!conceptualGraphId) {
            throw new Error('Cannot create relation type with label: ' + newRelationLabel + ". A conceptual graph must exist and id must be provided");
        }
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
                const concept: Concept = this.conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, singleConceptArgumentLabel);
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
        if (this.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, newRelationLabel)) {
            throw new Error('Cannot create relation with label: ' + newRelationLabel + ". A relation with that label already exists for conceptual graph with id: " + conceptualGraphId);
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
                return this.conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, singleConceptArgumentLabel);
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
                && ConceptUtil.hasAnyConceptTypes(conceptArguments[signatureIndex], possibleConceptTypeLabels);
        })
        return doesMatchAllInSignature;
    }

    getRelationById(relationIdToFind: RelationId): Relation {
        return this._clone(this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.id.relationId === relationIdToFind.relationId
                && singleRelation.id.conceptualGraphId === relationIdToFind.conceptualGraphId);
        }))
    }

    getRelationByConceptualGraphIdAndLabel(conceptualGraphId: string, relationLabel: string): Relation {
        return this._clone(this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.id.conceptualGraphId === conceptualGraphId
                && singleRelation.label === relationLabel)
        }))
    }

    updateRelation(relationToUpdate: Relation): Relation {
        this._validateRelationBeforeUpdate(relationToUpdate);
        this.relations.forEach((singleRelation) => {
            if (singleRelation.id
                && relationToUpdate.id
                && singleRelation.id.relationId === relationToUpdate.id.relationId
                && singleRelation.id.conceptualGraphId === relationToUpdate.id.conceptualGraphId) {
                singleRelation.conceptArgumentLabels = relationToUpdate.conceptArgumentLabels;
                singleRelation.label = relationToUpdate.label;
            }
            if (singleRelation.id
                && relationToUpdate.id
                && singleRelation.id.relationId === relationToUpdate.id.relationId
                && singleRelation.label === relationToUpdate.label) {
                singleRelation.id.conceptualGraphId = relationToUpdate.id.conceptualGraphId;
                singleRelation.conceptArgumentLabels = relationToUpdate.conceptArgumentLabels;
                singleRelation.label = relationToUpdate.label;
            }
        })
        return this._clone(relationToUpdate);
    }

    _validateRelationBeforeUpdate(relationToUpdate: Relation): void {
        if (!relationToUpdate || !relationToUpdate.id || !relationToUpdate.id.conceptualGraphId) {
            throw new Error('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have conceptual graph id');
        }
        if (!relationToUpdate.relationTypeLabels || relationToUpdate.relationTypeLabels.length === 0) {
            throw new Error('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have at least one relation type');
        }
        if (relationToUpdate.conceptArgumentLabels) {
            relationToUpdate.conceptArgumentLabels.forEach((singleConceptArgumentLabel) => {
                const concept: Concept = this.conceptDao.getConceptByConceptualGraphIdAndLabel(relationToUpdate.id.conceptualGraphId, singleConceptArgumentLabel);
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
            const possibleExistingRelation: Relation = this.getRelationByConceptualGraphIdAndLabel(relationToUpdate.id.conceptualGraphId, relationToUpdate.label);
            if (possibleExistingRelation && possibleExistingRelation.id.relationId !== relationToUpdate.id.relationId) {
                throw new Error('Could not update relation with label: '
                    + relationToUpdate.label
                    + '. Another relation with that label already exists for this conceptual graph. It has id: '
                    + possibleExistingRelation.id.relationId);
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
            let doesMatchSignature: boolean = false;
            for (let i = 0; i < relationToUpdate.relationTypeLabels.length && !doesMatchSignature; i++) {
                const relationTypeLabel = relationToUpdate.relationTypeLabels[i];
                const singleRelationType: RelationType = this.relationTypeDao.getRelationTypeByLabel(relationTypeLabel);
                relationToUpdate.conceptArgumentLabels.forEach((singleConceptArgumentLabel, argumentIndex) => {
                    const concept: Concept = this.conceptDao.getConceptByConceptualGraphIdAndLabel(relationToUpdate.id.conceptualGraphId, singleConceptArgumentLabel);
                    doesMatchSignature = singleRelationType.signature.reduce((accumulator, singleSignatureConceptTypeLabel) => {
                        const possibleConceptTypeLabels: string[]
                            = this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(singleSignatureConceptTypeLabel);
                        return accumulator && possibleConceptTypeLabels.reduce((accumulator, singlePossibleConceptTypeLabel) => {
                            return accumulator || concept.conceptTypeLabels.includes(singlePossibleConceptTypeLabel);
                        }, false)
                    }, true);
                    if (!doesMatchSignature) {
                        throw new Error('Cannot update relation with label: '
                            + relationToUpdate.label + ". Concept " + singleConceptArgumentLabel + " does not match any relation type signature");
                    }
                })

            }
        }
    }

    deleteRelation(idToDelete: RelationId): boolean {
        let isSuccessfulDelete: boolean = false;
        const lengthBeforeDelete: number = this.relations.length;
        this.relations = this.relations.filter((singleConcpet) => {
            return (singleConcpet.id.relationId !== idToDelete.relationId
                && singleConcpet.id.conceptualGraphId !== idToDelete.conceptualGraphId);
        })
        if (this.relations.length !== lengthBeforeDelete) {
            isSuccessfulDelete = true;
        }
        return isSuccessfulDelete;
    }

    _clone(relationToClone: Relation): Relation {
        return relationToClone ? {
            ...relationToClone,
            id: {
                ...relationToClone.id
            },
            relationTypeLabels: [...relationToClone.relationTypeLabels],
            conceptArgumentLabels: [...relationToClone.conceptArgumentLabels]
        } : relationToClone;
    }

}