import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Relation, RelationId } from "../../main/domain/Relation"
import { IdGenerator } from "../../main/util/IdGenerator";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { ConceptDao } from "../../main/dao/ConceptDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { Concept } from "../../main/domain/Concept";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);

const entityConceptTypeLabel: string = 'Entity';
const subEntityConceptTypeLabel: string = 'SubEntity';
const subSubEntityConceptTypeLabel: string = 'SubSubEntity';
const nonExistentConceptTypeLabel: string = 'NonExistentEntity';
const entityConceptLabel1: string = "EntityConcept1"
const entityConceptLabel2: string = "EntityConcept2"
const nonExistentConceptLabel: string = "NonExistentEntityConcept"
const linkRelationTypeLabel: string = 'Link';
const subLinkRelationTypeLabel: string = 'SubLink';
const subSubLinkRelationTypeLabel: string = 'SubSubLink';
const nonExistentRelationTypeLabel: string = 'NonExistentLink';
const relationLabelPrefix1: string = 'Relation1-';
const relationLabelPrefix2: string = 'Relation2-';

describe('RelationDao basic tests', () => {

    beforeAll(() => {
        conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: entityConceptTypeLabel,
            subConceptTypes: [{
                label: subEntityConceptTypeLabel,
                subConceptTypes: [{
                    label: subSubEntityConceptTypeLabel
                }]
            }]
        }]);

        relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: linkRelationTypeLabel,
            signature: [entityConceptTypeLabel],
            subRelationTypes: [{
                label: subLinkRelationTypeLabel,
                signature: [subEntityConceptTypeLabel],
                subRelationTypes: [{
                    label: subSubLinkRelationTypeLabel,
                    signature: [subSubEntityConceptTypeLabel]
                }]
            }]
        }]);
    })

    it('Create Relation with some concept arguments', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");

        const relation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        expect(relation.id).not.toBeNull();
        relation.id.conceptualGraphId
        expect(relation).toEqual({
            id: {
                relationId: relation.id.relationId,
                conceptualGraphId: conceptualGraphId
            },
            label: relationLabel,
            relationTypeLabels: [linkRelationTypeLabel],
            conceptArguments: conceptArgumentLabels
        });
    })

    it('Error: Create Relation with non-existent relation type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [nonExistentRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". Relation Type '"
                + nonExistentRelationTypeLabel + "' does not exist");
    })

    it('Error: Create Relation must have a relation type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". Needs at least one relation type");
    })

    it('Error: Create Relation must have a conceptual graph id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];

        expect(() => relationDao.createRelation(null, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation type with label: ' + relationLabel + ". A conceptual graph must exist and id must be provided");
    })

    it('Error: Create Relation with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const relation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". A relation with that label already exists for conceptual graph with id: " + conceptualGraphId);
    })

    it('Error: Create Relation with Concept whose Concept Type does not match Relation Type signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Concept " + entityConceptLabel1 + " does not match any relation type signature");
    })

    it('Error: Create Relation with more concepts than concept type in signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1, entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Number of concept arguments (2) does not match number of concept types in relation type signature (1)");
    })

    it('Error: Create Relation with a concept that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [nonExistentConceptLabel];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(conceptualGraphId, relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Concept given as argument ("
                + nonExistentConceptLabel + ") does not exist");
    })

    it('Get relation by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        const relationIdToFind: RelationId = {
            relationId: createdRelation.id.relationId,
            conceptualGraphId: conceptualGraphId
        }
        const savedRelation: Relation = relationDao.getRelationById(relationIdToFind);
        expect(createdRelation).toEqual(savedRelation);
    })

    it('Get relation by conceptual graph id and label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        const savedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, relationLabel);
        expect(createdRelation).toEqual(savedRelation);
    })

    it('Update relation referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const oldConceptArgumentLabels: string[] = [entityConceptLabel1];
        const newConceptArgumentLabels: string[] = [entityConceptLabel2];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], oldConceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: newConceptArgumentLabels
        }

        const updatedRelation: Relation = relationDao.updateRelation(relationToUpdate);

        const savedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, relationLabel);
        expect(createdRelation).not.toEqual(updatedRelation);
        expect(relationToUpdate).toEqual(updatedRelation);
        expect(savedRelation).toEqual(updatedRelation);
    })

    it('Update relation label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const oldRelationLabel: string = relationLabelPrefix1 + testId + "-old";
        const newRelationLabel: string = relationLabelPrefix1 + testId + "-new";
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, oldRelationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            label: newRelationLabel
        }

        const updatedRelation: Relation = relationDao.updateRelation(relationToUpdate);

        const savedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, newRelationLabel);
        expect(createdRelation).not.toEqual(updatedRelation);
        expect(relationToUpdate).toEqual(updatedRelation);
        expect(savedRelation).toEqual(updatedRelation);
    })

    it('Update relation conceptual graph', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const oldConceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const newConceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept1: Concept = conceptDao.createConcept(oldConceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(newConceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(oldConceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id,
                conceptualGraphId: newConceptualGraphId
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels]
        }

        const updatedRelation: Relation = relationDao.updateRelation(relationToUpdate);

        const savedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(newConceptualGraphId, relationLabel);
        expect(createdRelation).not.toEqual(updatedRelation);
        expect(relationToUpdate).toEqual(updatedRelation);
        expect(savedRelation).toEqual(updatedRelation);
    })

    it('Error: Update Relation with non-existent relation type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id,
            },
            relationTypeLabels: [nonExistentRelationTypeLabel]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label + '. No relation type label: '
                + nonExistentRelationTypeLabel);
    })

    it('Error: Update Relation must have a relation type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id,
            },
            relationTypeLabels: []
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have at least one relation type');
    })

    it('Error: Update Relation must have a conceptual graph id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id,
                conceptualGraphId: null
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have conceptual graph id');
    })

    it('Error: Update Relation with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const existingLabel: string = relationLabelPrefix1 + testId;
        const newLabel: string = relationLabelPrefix2 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const existingRelation: Relation = relationDao.createRelation(conceptualGraphId, existingLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, newLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            label: existingLabel
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label
                + '. Another relation with that label already exists for this conceptual graph. It has id: '
                + existingRelation.id.relationId);
    })

    it('Error: Update Relation with Concept whose Concept Type does not match Relation Type signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = entityConceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: [entityConceptLabel2]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Cannot update relation with label: '
                + relationLabel + ". Concept " + entityConceptLabel2 + " does not match any relation type signature");
    })

    it('Error: Update Relation with more concepts than concept type in signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = entityConceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: [entityConceptLabel1, entityConceptLabel2]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Cannot update relation with label: '
                + relationLabel + ". Number of concept arguments (2) does not match number of concept types in relation type signature (1)");
    })

    it('Error: Create Relation with a concept that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = entityConceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: {
                ...createdRelation.id
            },
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: [nonExistentConceptLabel]
        }


        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Cannot update relation with label: '
                + relationLabel + ". Concept given as argument ("
                + nonExistentConceptLabel + ") does not exist");
    })

    it('Delete relation', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const label: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptualGraphId, entityConceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(conceptualGraphId, label, [linkRelationTypeLabel], conceptArgumentLabels);

        const isSuccessfulDelete: boolean = relationDao.deleteRelation(createdRelation.id);

        expect(isSuccessfulDelete).toBe(true);
        const deletedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, label);
        expect(deletedRelation).toBeUndefined();
    })

    it('Delete nonexistent relation should return false', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const label: string = relationLabelPrefix1 + testId;
        const idToDelete: RelationId = {
            relationId: IdGenerator.getInstance().getNextUniqueRelationId(),
            conceptualGraphId: conceptualGraphId
        }

        const isSuccessfulDelete: boolean = relationDao.deleteRelation(idToDelete);

        expect(isSuccessfulDelete).toBe(false);
        const deletedRelation: Relation = relationDao.getRelationByConceptualGraphIdAndLabel(conceptualGraphId, label);
        expect(deletedRelation).toBeUndefined();
    })

})