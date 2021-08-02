import { Relation, RelationId } from "../../domain/Relation";
import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao } from "../ConceptTypeDao";
import { RelationDao } from "../RelationDao";
import { RelationTypeDao, NoSuchRelationTypeError } from "../RelationTypeDao";
import { Store } from "./store/Store";

export class InMemoryRelationDao implements RelationDao {
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    relations: Relation[] = Store.getInstance().state.relations;

    constructor(conceptTypeDao: ConceptTypeDao, relationTypeDao: RelationTypeDao) {
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
        newRelation.conceptArguments = conceptArgumentLabels;
        this.relations.push(newRelation);
        return this._clone(newRelation);
    }

    _validateRelationBeforeCreate(conceptualGraphId: string, newRelationLabel: string, relationTypeLabels: string[], conceptArgumentLabels: string[]) {
        if (!conceptualGraphId) {
            throw new Error('Cannot create relation type with label: ' + newRelationLabel + ". A relationual graph must exist and id must be provided");
        }
        if (relationTypeLabels) {
            relationTypeLabels.forEach((singleRelationTypeLabel) => {
                if (!this.relationTypeDao.getRelationTypeByLabel(singleRelationTypeLabel)) {
                    throw new NoSuchRelationTypeError('Cannot create relation type with label: ' + newRelationLabel + ". Relation Type '"
                        + singleRelationTypeLabel + "' does not exist");
                }
            })
        }
        if (!relationTypeLabels || relationTypeLabels.length === 0) {
            throw new Error('Cannot create relation type with label: ' + newRelationLabel + ". Needs at least one relation type");
        }
        if (this.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, newRelationLabel)) {
            throw new Error('Cannot create relation type with label: ' + newRelationLabel + ". A relation with that label already exists for relationual graph with id: " + conceptualGraphId);
        }
    }

    getRelationById(relationIdToFind: RelationId): Relation {
        return this._clone(this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.id.relationId === relationIdToFind.relationId
                && singleRelation.id.conceptualGraphId === relationIdToFind.conceptualGraphId);
        }))
    }

    getRelationByConceptualGraphIdAndLabel(conceptualGraphId: string, relationLabel: string): Relation {
        return this.relations.find((singleRelation) => {
            return (singleRelation.id
                && singleRelation.id.conceptualGraphId === conceptualGraphId
                && singleRelation.label === relationLabel)
        })
    }

    updateRelation(relationToUpdate: Relation): Relation {
        this._validateRelationBeforeUpdate(relationToUpdate);
        this.relations.forEach((singleRelation) => {
            if (singleRelation.id
                && relationToUpdate.id
                && singleRelation.id.relationId === relationToUpdate.id.relationId
                && singleRelation.id.conceptualGraphId === relationToUpdate.id.conceptualGraphId) {
                singleRelation.conceptArguments = relationToUpdate.conceptArguments;
                singleRelation.label = relationToUpdate.label;
            }
            if (singleRelation.id
                && relationToUpdate.id
                && singleRelation.id.relationId === relationToUpdate.id.relationId
                && singleRelation.label === relationToUpdate.label) {
                singleRelation.id.conceptualGraphId = relationToUpdate.id.conceptualGraphId;
                singleRelation.conceptArguments = relationToUpdate.conceptArguments;
                singleRelation.label = relationToUpdate.label;
            }
        })
        return this._clone(relationToUpdate);
    }

    _validateRelationBeforeUpdate(relationToUpdate: Relation): void {
        if (!relationToUpdate || !relationToUpdate.id || !relationToUpdate.id.conceptualGraphId) {
            throw new Error('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have relationual graph id');
        }
        if (!relationToUpdate.relationTypeLabels || relationToUpdate.relationTypeLabels.length === 0) {
            throw new Error('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have at least one relation type');
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
                    + '. Another relation with that label already exists for this relationual graph. It has id: '
                    + possibleExistingRelation.id.relationId);
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
            relationTypeLabels: [...relationToClone.relationTypeLabels]
        } : relationToClone;
    }

}