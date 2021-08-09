import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Relation } from "../../main/domain/Relation"
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
const entityConceptLabelPrefix1: string = "EntityConcept1-"
const entityConceptLabelPrefix2: string = "EntityConcept2-"
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
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabelPrefix1];
        const entityConcept: Concept = conceptDao.createConcept(entityConceptLabelPrefix1, [entityConceptTypeLabel], "TextReferent");

        const relation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        expect(relation.id).not.toBeNull();
        expect(relation).toEqual({
            id: relation.id,
            label: relationLabel,
            relationTypeLabels: [linkRelationTypeLabel],
            conceptArgumentLabels: conceptArgumentLabels
        });
    })

    it('Error: Create Relation with non-existent relation type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [entityConceptLabelPrefix1];

        expect(() => relationDao.createRelation(relationLabel, [nonExistentRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". Relation Type '"
                + nonExistentRelationTypeLabel + "' does not exist");
    })

    it('Error: Create Relation must have a relation type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(relationLabel, [], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". Needs at least one relation type");
    })

    it('Error: Create Relation with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const relation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        expect(() => relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: ' + relationLabel + ". A relation with that label already exists");
    })

    it('Error: Create Relation with Concept whose Concept Type does not match Relation Type signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Argument concept types of arguments (" + conceptLabel1
                + ") do not match any signatures of relation types: "
                + subLinkRelationTypeLabel);
    })

    it('Error: Create Relation with more concepts than concept type in signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1, conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Number of concept arguments (2) does not match number of concept types in relation type signature (1)");
    })

    it('Error: Create Relation with a concept that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [nonExistentConceptLabel];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");

        expect(() => relationDao.createRelation(relationLabel, [subLinkRelationTypeLabel], conceptArgumentLabels))
            .toThrow('Cannot create relation with label: '
                + relationLabel + ". Concept given as argument ("
                + nonExistentConceptLabel + ") does not exist");
    })

    it('Get relation by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        const relationIdToFind: string = createdRelation.id;
        const savedRelation: Relation = relationDao.getRelationById(relationIdToFind);
        expect(createdRelation).toEqual(savedRelation);
    })

    it('Get relation by conceptual graph id and label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);

        const savedRelation: Relation = relationDao.getRelationByLabel(relationLabel);
        expect(createdRelation).toEqual(savedRelation);
    })

    it('Update relation referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const conceptLabel2: string = entityConceptLabelPrefix2 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const oldConceptArgumentLabels: string[] = [conceptLabel1];
        const newConceptArgumentLabels: string[] = [conceptLabel2];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], oldConceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: newConceptArgumentLabels
        }

        const updatedRelation: Relation = relationDao.updateRelation(relationToUpdate);

        const savedRelation: Relation = relationDao.getRelationByLabel(relationLabel);
        expect(createdRelation).not.toEqual(updatedRelation);
        expect(relationToUpdate).toEqual(updatedRelation);
        expect(savedRelation).toEqual(updatedRelation);
    })

    it('Update relation label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const oldRelationLabel: string = relationLabelPrefix1 + testId + "-old";
        const newRelationLabel: string = relationLabelPrefix1 + testId + "-new";
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(oldRelationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            label: newRelationLabel
        }

        const updatedRelation: Relation = relationDao.updateRelation(relationToUpdate);

        const savedRelation: Relation = relationDao.getRelationByLabel(newRelationLabel);
        expect(createdRelation).not.toEqual(updatedRelation);
        expect(relationToUpdate).toEqual(updatedRelation);
        expect(savedRelation).toEqual(updatedRelation);
    })

    it('Error: Update Relation with non-existent relation type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [nonExistentRelationTypeLabel]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label + '. No relation type label: '
                + nonExistentRelationTypeLabel);
    })

    it('Error: Update Relation must have a relation type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: []
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label
                + '. A relation must have at least one relation type');
    })

    it('Error: Update Relation with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const existingLabel: string = relationLabelPrefix1 + testId;
        const newLabel: string = relationLabelPrefix2 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const existingRelation: Relation = relationDao.createRelation(existingLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const createdRelation: Relation = relationDao.createRelation(newLabel, [linkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            label: existingLabel
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Could not update relation with label: '
                + relationToUpdate.label
                + '. Another relation with that label already exists for this conceptual graph. It has id: '
                + existingRelation.id);
    })

    it('Error: Update Relation with Concept whose Concept Type does not match Relation Type signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const conceptLabel2: string = entityConceptLabelPrefix2 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = conceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: [conceptLabel2]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Cannot update relation with label: '
                + relationLabel + ". Argument concept types of arguments (" + conceptLabel2 
                + ") do not match any signatures of relation types: "
                + subSubLinkRelationTypeLabel);
    })

    it('Error: Update Relation with more concepts than concept type in signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const conceptLabel2: string = entityConceptLabelPrefix2 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = conceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
            relationTypeLabels: [...createdRelation.relationTypeLabels],
            conceptArgumentLabels: [conceptLabel1, conceptLabel2]
        }

        expect(() => relationDao.updateRelation(relationToUpdate))
            .toThrow('Cannot update relation with label: '
                + relationLabel + ". Number of concept arguments (2) does not match number of concept types in relation type signature (1)");
    })

    it('Error: Create Relation with a concept that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const conceptLabel2: string = entityConceptLabelPrefix2 + testId;
        const relationLabel: string = relationLabelPrefix1 + testId;
        const conceptLabel: string = conceptLabel1 + testId;
        const entityConcept1: Concept = conceptDao.createConcept(conceptLabel1, [subSubEntityConceptTypeLabel], "TextReferent");
        const entityConcept2: Concept = conceptDao.createConcept(conceptLabel2, [entityConceptTypeLabel], "TextReferent");
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const createdRelation: Relation = relationDao.createRelation(relationLabel, [subSubLinkRelationTypeLabel], conceptArgumentLabels);
        const relationToUpdate: Relation = {
            ...createdRelation,
            id: createdRelation.id,
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
        const conceptLabel1: string = entityConceptLabelPrefix1 + testId;
        const label: string = relationLabelPrefix1 + testId;
        const conceptArgumentLabels: string[] = [conceptLabel1];
        const entityConcept: Concept = conceptDao.createConcept(conceptLabel1, [entityConceptTypeLabel], "TextReferent");
        const createdRelation: Relation = relationDao.createRelation(label, [linkRelationTypeLabel], conceptArgumentLabels);

        const isSuccessfulDelete: boolean = relationDao.deleteRelation(createdRelation.id);

        expect(isSuccessfulDelete).toBe(true);
        const deletedRelation: Relation = relationDao.getRelationByLabel(label);
        expect(deletedRelation).toBeUndefined();
    })

    it('Delete nonexistent relation should return false', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const label: string = relationLabelPrefix1 + testId;
        const idToDelete: string = IdGenerator.getInstance().getNextUniqueRelationId();

        const isSuccessfulDelete: boolean = relationDao.deleteRelation(idToDelete);

        expect(isSuccessfulDelete).toBe(false);
        const deletedRelation: Relation = relationDao.getRelationByLabel(label);
        expect(deletedRelation).toBeUndefined();
    })

})