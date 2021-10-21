import { RelationType, SimpleRelationType } from "../../main/domain/RelationType";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);

const testRootRelationTypeLabelPrefix1: string = 'TestRootRelation1-';
const testRootRelationTypeLabelPrefix2: string = 'TestRootRelation2-';
const testRootRelationTypeLabelPrefix3: string = 'TestRootRelation3-';
const testSubRelationTypeLabelPrefix1: string = 'TestSubRelation1-';
const testSubRelationTypeLabelPrefix2: string = 'TestSubRelation2-';
const testSubSubRelationTypeLabelPrefix1: string = 'TestSubSubRelation1-';
const testSubSubRelationTypeLabelPrefix2: string = 'TestSubSubRelation2-';
const entityConceptTypeLabel: string = 'Entity';
const subEntityConceptTypeLabel: string = 'SubEntity';
const subSubEntityConceptTypeLabel: string = 'SubSubEntity';
const nonExistentConceptTypeLabel: string = 'NonExistentEntity';

describe('RelationTypeDao basic tests', () => {

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
    })

    it('Create Relation Type at root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;

        const relationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);

        expect(relationType.id).not.toBeNull();
        expect(relationType).toEqual({
            id: relationType.id,
            label: testRootRelationTypeLabel,
            parentRelationTypeLabels: [],
            subRelationTypeLabels: [],
            signature: [entityConceptTypeLabel]
        });
    })

    it('Create Relation Type as child of single existing parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const existingParentRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const newSubRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        let rootRelationType: RelationType = relationTypeDao.createRelationType(existingParentRelationTypeLabel, [entityConceptTypeLabel]);

        const subRelationType: RelationType = relationTypeDao.createRelationType(newSubRelationTypeLabel, [entityConceptTypeLabel], [existingParentRelationTypeLabel]);

        rootRelationType = relationTypeDao.getRelationTypeByLabel(existingParentRelationTypeLabel);
        expect(rootRelationType.subRelationTypeLabels).toEqual([subRelationType.label]);
        expect(subRelationType.id).not.toBeNull();
        expect(subRelationType).toEqual({
            id: subRelationType.id,
            label: newSubRelationTypeLabel,
            parentRelationTypeLabels: [existingParentRelationTypeLabel],
            subRelationTypeLabels: [],
            signature: [entityConceptTypeLabel]
        });
    })

    it('Create Relation Type as child of two existing parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const existingParentRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const existingParentRelationTypeLabel2: string = testRootRelationTypeLabelPrefix2 + testId;
        const newSubRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        let rootRelationType1: RelationType = relationTypeDao.createRelationType(existingParentRelationTypeLabel1, [entityConceptTypeLabel]);
        let rootRelationType2: RelationType = relationTypeDao.createRelationType(existingParentRelationTypeLabel2, [entityConceptTypeLabel]);

        const subRelationType: RelationType = relationTypeDao.createRelationType(newSubRelationTypeLabel, [subSubEntityConceptTypeLabel],
            [existingParentRelationTypeLabel1, existingParentRelationTypeLabel2]);

        rootRelationType1 = relationTypeDao.getRelationTypeByLabel(existingParentRelationTypeLabel1);
        rootRelationType2 = relationTypeDao.getRelationTypeByLabel(existingParentRelationTypeLabel2);
        expect(rootRelationType1.subRelationTypeLabels).toEqual([subRelationType.label]);
        expect(rootRelationType2.subRelationTypeLabels).toEqual([subRelationType.label]);
        expect(subRelationType.id).not.toBeNull();
        expect(subRelationType).toEqual({
            id: subRelationType.id,
            label: newSubRelationTypeLabel,
            parentRelationTypeLabels: [existingParentRelationTypeLabel1, existingParentRelationTypeLabel2],
            subRelationTypeLabels: [],
            signature: [subSubEntityConceptTypeLabel]
        });
    })

    it('Create Relation Type should return transient object', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;

        const createdRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);
        createdRelationType.label = "SomethingElse";
        const savedRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(testRootRelationTypeLabel);

        expect(createdRelationType).not.toEqual(savedRelationType);
    })

    it('Create Sub Relation Type with signature as a specification of parent signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();

        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;

        const rootRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel, entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [subEntityConceptTypeLabel, subSubEntityConceptTypeLabel]);

        expect(subRelationType).toEqual({
            ...subRelationType,
            signature: [subEntityConceptTypeLabel, subSubEntityConceptTypeLabel]
        });
    })

    it('Error: Create Relation Type with non-existent concept type in signature', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;

        expect(() => relationTypeDao.createRelationType(testRootRelationTypeLabel, [nonExistentConceptTypeLabel]))
            .toThrow(`Could not create relation type with label: ${testRootRelationTypeLabel}. No such concept type: ${nonExistentConceptTypeLabel}`);
    })

    it('Error: Create Relation Type with concept type which is not a specialization of parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType
            = relationTypeDao.createRelationType(testRootRelationTypeLabel, [subEntityConceptTypeLabel, subSubEntityConceptTypeLabel]);

        expect(() => relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel, subEntityConceptTypeLabel], [testRootRelationTypeLabel]))
            .toThrow('Could not create relation type with label: ' + subRelationTypeLabel
                + '. Provided signature: ' + [entityConceptTypeLabel, subEntityConceptTypeLabel]
                + ' is not a specialization of any parent signature'
                + '. Specifically concept type: ' + entityConceptTypeLabel);
    })

    it('Error: Create Relation Type with valence of 0', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;

        expect(() => relationTypeDao.createRelationType(testRootRelationTypeLabel, []))
            .toThrow(`Could not create relation type with label: ${testRootRelationTypeLabel}. Signature needs at least one concept type`);
    })

    it('Error: Create Relation Type with signature valence not the same as parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType
            = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);

        expect(() => relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel, entityConceptTypeLabel], [testRootRelationTypeLabel]))
            .toThrow('Could not create relation type with label: '
                + subRelationTypeLabel
                + '. Signature needs the same number of concept types as parent'
                + testRootRelationTypeLabel + '" (Signature: ' + rootRelationType.signature + ')');
    })

    it('Error: Create Relation Type with non-existent parent should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const nonExistentparentRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const newSubRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;

        expect(() => relationTypeDao.createRelationType(newSubRelationTypeLabel, [entityConceptTypeLabel], [nonExistentparentRelationTypeLabel]))
            .toThrow(`Could not create relation '${newSubRelationTypeLabel}'. No parent relation type with label: '${nonExistentparentRelationTypeLabel}'.`);
    })

    it('Error: Create Duplicate Root Relation Type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        let rootRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);

        expect(() => relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]))
            .toThrow(`Could not create relation '${testRootRelationTypeLabel}'. A relation with that label already exists.`);
    })

    it('Error: Create Duplicate Sub Relation Type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const newSubRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        let rootRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);
        let existingRelationType: RelationType = relationTypeDao.createRelationType(newSubRelationTypeLabel, [entityConceptTypeLabel], [testRootRelationTypeLabel]);

        expect(() => relationTypeDao.createRelationType(newSubRelationTypeLabel, [subSubEntityConceptTypeLabel], [testRootRelationTypeLabel]))
            .toThrow(`Could not create relation '${newSubRelationTypeLabel}'. A relation with that label already exists.`);
    })

    it('Error: Create Relation Type with parent as itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        let rootRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);

        expect(() => relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel], [testRootRelationTypeLabel]))
            .toThrow(`Could not create relation '${testRootRelationTypeLabel}'. A relation cannot reference itself as parent`);
    })

    it('Get Relation Type by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        let createdRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);
        let gottenRelationType: RelationType = relationTypeDao.getRelationTypeById(createdRelationType.id);
        expect(createdRelationType).toEqual(gottenRelationType);
    })

    it('Get Relation Type by label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        let createdRelationType: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel, [entityConceptTypeLabel]);
        let gottenRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(testRootRelationTypeLabel);
        expect(createdRelationType).toEqual(gottenRelationType);
    })

    it('Get Root Relation Types', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const testRootRelationTypeLabel2: string = testRootRelationTypeLabelPrefix2 + testId;
        const testRootRelationTypeLabel3: string = testRootRelationTypeLabelPrefix3 + testId;
        let rootRelationType1: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel1, [entityConceptTypeLabel]);
        let rootRelationType2: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel2, [entityConceptTypeLabel]);
        let rootRelationType3: RelationType = relationTypeDao.createRelationType(testRootRelationTypeLabel3, [entityConceptTypeLabel]);
        let rootRelationTypes: RelationType[] = relationTypeDao.getRootRelationTypes();
        expect(rootRelationTypes).toContainEqual(rootRelationType1);
        expect(rootRelationTypes).toContainEqual(rootRelationType2);
        expect(rootRelationTypes).toContainEqual(rootRelationType3);
    })

    it('Error: Get Relation Type by Id when none exist should return undefined', () => {
        const testRelationTypeId: string = IdGenerator.getInstance().getNextUniqueRelationTypeId();
        const rootRelationType: RelationType = relationTypeDao.getRelationTypeById(testRelationTypeId);
        expect(rootRelationType).toBeUndefined();
    })

    it('Error: Get Relation Type by label when none exist should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(testRootRelationTypeLabel1);
        expect(rootRelationType).toBeUndefined();
    })

    it('Update Root Relation Type label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const originalRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId + '-old';
        const newRelationTypeLabel: string = testRootRelationTypeLabelPrefix2 + testId + '-new';
        const createdRelationType: RelationType = relationTypeDao.createRelationType(originalRelationTypeLabel, [entityConceptTypeLabel]);
        const relationTypeToUpdate: RelationType = { ...createdRelationType, label: newRelationTypeLabel };

        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(newRelationTypeLabel);
        expect(updatedRelationType).toEqual(savedRelationType);
        expect(updatedRelationType).not.toEqual(createdRelationType);
    })

    it('Update Sub Relation Type label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const oldRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId + '-old';
        const newRelationTypeLabel: string = testSubRelationTypeLabelPrefix2 + testId + '-new';
        const rootRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const createdRelationType: RelationType = relationTypeDao.createRelationType(oldRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel]);
        const relationTypeToUpdate: RelationType = { ...createdRelationType, label: newRelationTypeLabel };

        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(newRelationTypeLabel);
        expect(updatedRelationType).toEqual(savedRelationType);
        expect(updatedRelationType).not.toEqual(createdRelationType);
    })

    it('Update Relation Type label should update parent and sub relation types', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const oldRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId + '-old';
        const newRelationTypeLabel: string = testSubRelationTypeLabelPrefix2 + testId + '-new';
        const subSubRelationTypeLabel: string = testSubSubRelationTypeLabelPrefix1 + testId;
        const oldRootRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const createdRelationType: RelationType = relationTypeDao.createRelationType(oldRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel]);
        const oldSubSubRelationType: RelationType = relationTypeDao.createRelationType(subSubRelationTypeLabel, [entityConceptTypeLabel], [oldRelationTypeLabel]);
        const relationTypeToUpdate: RelationType = { ...createdRelationType, label: newRelationTypeLabel };

        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const newRootRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(rootRelationTypeLabel);
        const newSubSubRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(subSubRelationTypeLabel);
        expect(newRootRelationType.subRelationTypeLabels[0]).toBe(newRelationTypeLabel);
        expect(newSubSubRelationType.parentRelationTypeLabels[0]).toBe(newRelationTypeLabel);
    })

    it('Update Relation Type structure to add parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            parentRelationTypeLabels: [...relationTypeToUpdate.parentRelationTypeLabels]
        };

        relationTypeToUpdate.parentRelationTypeLabels.push(rootRelationTypeLabel);
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(updatedRelationType).toEqual(savedRelationType);
        expect(updatedRelationType).not.toEqual(originalRelationTypeToUpdate);
        expect(updatedRelationType).toEqual({
            ...originalRelationTypeToUpdate,
            parentRelationTypeLabels: [rootRelationTypeLabel]
        });
        const newRootRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(rootRelationTypeLabel);
        expect(newRootRelationType).not.toEqual(rootRelationType);
        expect(newRootRelationType).toEqual({
            ...rootRelationType,
            subRelationTypeLabels: [subRelationTypeLabel]
        });
    })

    it('Update Relation Type structure to add parent and remove from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            parentRelationTypeLabels: [...relationTypeToUpdate.parentRelationTypeLabels]
        };
        expect(relationTypeDao.getRootRelationTypes()).toContainEqual(relationTypeToUpdate);

        relationTypeToUpdate.parentRelationTypeLabels.push(rootRelationTypeLabel);
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);
        expect(relationTypeDao.getRootRelationTypes()).not.toContainEqual(relationTypeToUpdate);
    })

    it('Update Relation Type structure to remove parent but not move to root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const rootRelationTypeLabel2: string = testRootRelationTypeLabelPrefix2 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType1: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel1, [entityConceptTypeLabel]);
        const rootRelationType2: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel2, [entityConceptTypeLabel]);
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel1, rootRelationTypeLabel2]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            parentRelationTypeLabels: [...relationTypeToUpdate.parentRelationTypeLabels]
        };

        relationTypeToUpdate.parentRelationTypeLabels = [rootRelationTypeLabel1];
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);
        expect(relationTypeDao.getRootRelationTypes()).not.toContainEqual(relationTypeToUpdate);
    })

    it('Update Relation Type structure to remove parent and move to root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType1: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel1, [entityConceptTypeLabel]);
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel1]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            parentRelationTypeLabels: [...relationTypeToUpdate.parentRelationTypeLabels]
        };

        relationTypeToUpdate.parentRelationTypeLabels = [];
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);
        expect(relationTypeDao.getRootRelationTypes()).toContainEqual(relationTypeToUpdate);
    })

    it('Update Relation Type structure to add child', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            subRelationTypeLabels: [...relationTypeToUpdate.subRelationTypeLabels]
        };

        relationTypeToUpdate.subRelationTypeLabels.push(subRelationTypeLabel);
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(rootRelationTypeLabel);
        expect(updatedRelationType).toEqual(savedRelationType);
        expect(updatedRelationType).not.toEqual(originalRelationTypeToUpdate);
        expect(updatedRelationType).toEqual({
            ...originalRelationTypeToUpdate,
            subRelationTypeLabels: [subRelationTypeLabel]
        });
        const newSubRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(newSubRelationType).not.toEqual(subRelationType);
        expect(newSubRelationType).toEqual({
            ...subRelationType,
            parentRelationTypeLabels: [rootRelationTypeLabel]
        });
    })

    it('Update Relation Type structure to add child and remove child from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            subRelationTypeLabels: [...relationTypeToUpdate.subRelationTypeLabels]
        };
        expect(relationTypeDao.getRootRelationTypes()).toContainEqual(subRelationType);

        relationTypeToUpdate.subRelationTypeLabels.push(subRelationTypeLabel);
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedSubRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(relationTypeDao.getRootRelationTypes()).not.toContainEqual(savedSubRelationType);
    })

    it('Update Relation Type structure to remove child should add child to root if it has no other parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [subSubEntityConceptTypeLabel], [rootRelationTypeLabel]);
        const originalRelationTypeToUpdate: RelationType = {
            ...relationTypeToUpdate,
            subRelationTypeLabels: [...relationTypeToUpdate.subRelationTypeLabels]
        };
        expect(relationTypeDao.getRootRelationTypes()).not.toContainEqual(subRelationType);

        relationTypeToUpdate.subRelationTypeLabels = [];
        const updatedRelationType: RelationType = relationTypeDao.updateRelationType(relationTypeToUpdate);

        const savedSubRelationType: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(relationTypeDao.getRootRelationTypes()).toContainEqual(savedSubRelationType);
    })

    it('Error: Update Relation Type with no id should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        relationTypeToUpdate.id = undefined;

        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. Id is ${relationTypeToUpdate.id}.`)
    })

    it('Error: Update Relation Type label to something that already exists should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const rootRelationTypeLabel2: string = testRootRelationTypeLabelPrefix2 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel1, [entityConceptTypeLabel]);
        const existingRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel2, [entityConceptTypeLabel]);
        relationTypeToUpdate.label = rootRelationTypeLabel2;

        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. Id is ${relationTypeToUpdate.id}. A relation type with that label already exists with id ${existingRelationType.id}`)
    })

    it('Error: Update Relation Type structure to add child which is itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel1, [entityConceptTypeLabel]);

        relationTypeToUpdate.subRelationTypeLabels.push(rootRelationTypeLabel1);
        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. One of the sub relation types is listed as itself`);
    })

    it('Error: Update Relation Type structure to add parent which is itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel1: string = testRootRelationTypeLabelPrefix1 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel1, [entityConceptTypeLabel]);

        relationTypeToUpdate.parentRelationTypeLabels.push(rootRelationTypeLabel1);
        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. One of the parent relation types is listed as itself`);
    })

    it('Error: Update Relation Type structure to point to relation type that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const nonExistentRelationTypeLabel: string = testRootRelationTypeLabelPrefix2 + testId;
        const relationTypeToUpdate: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);

        relationTypeToUpdate.parentRelationTypeLabels.push(nonExistentRelationTypeLabel);
        relationTypeToUpdate.subRelationTypeLabels = [];
        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. No such parent relation type: ${nonExistentRelationTypeLabel}`);

        relationTypeToUpdate.subRelationTypeLabels.push(nonExistentRelationTypeLabel);
        relationTypeToUpdate.parentRelationTypeLabels = [];
        expect(() => relationTypeDao.updateRelationType(relationTypeToUpdate))
            .toThrow(`Could not update relation type with label: ${relationTypeToUpdate.label}. No such sub relation type: ${nonExistentRelationTypeLabel}`);
    })

    it('Delete Relation Type from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const relationTypeToDelete: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);

        const isSuccessfulDeletion: boolean = relationTypeDao.deleteRelationType(relationTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        expect(relationTypeDao.getRelationTypeByLabel(relationTypeToDelete.label)).toBeUndefined();
        expect(relationTypeDao.getRootRelationTypes()).not.toContainEqual(relationTypeToDelete);
    })

    it('Delete Sub Relation Type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const rootRelationType: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const relationTypeToDelete: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel]);
        const rootBeforeDelete: RelationType = relationTypeDao.getRelationTypeByLabel(rootRelationTypeLabel);
        expect(rootBeforeDelete).toEqual({
            ...rootRelationType,
            subRelationTypeLabels: [subRelationTypeLabel]
        });

        const isSuccessfulDeletion: boolean = relationTypeDao.deleteRelationType(relationTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const rootAfterDelete: RelationType = relationTypeDao.getRelationTypeByLabel(rootRelationTypeLabel);
        expect(rootBeforeDelete).not.toEqual(rootAfterDelete);
        expect(rootAfterDelete).toEqual({
            ...rootBeforeDelete,
            subRelationTypeLabels: []
        });
    })

    it('Delete Parent Relation Type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const relationTypeToDelete: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel]);
        const subBeforeDelete: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(subBeforeDelete).toEqual({
            ...subRelationType,
            parentRelationTypeLabels: [rootRelationTypeLabel]
        });

        const isSuccessfulDeletion: boolean = relationTypeDao.deleteRelationType(relationTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const subAfterDelete: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(subBeforeDelete).not.toEqual(subAfterDelete);
        expect(subAfterDelete).toEqual({
            ...subBeforeDelete,
            parentRelationTypeLabels: []
        });
    })

    it('Delete Parent Relation Type should move subs to root if no other parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootRelationTypeLabel: string = testRootRelationTypeLabelPrefix1 + testId;
        const subRelationTypeLabel: string = testSubRelationTypeLabelPrefix1 + testId;
        const relationTypeToDelete: RelationType = relationTypeDao.createRelationType(rootRelationTypeLabel, [entityConceptTypeLabel]);
        const subRelationType: RelationType = relationTypeDao.createRelationType(subRelationTypeLabel, [entityConceptTypeLabel], [rootRelationTypeLabel]);
        const subBeforeDelete: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(subBeforeDelete).toEqual({
            ...subRelationType,
            parentRelationTypeLabels: [rootRelationTypeLabel]
        });

        const isSuccessfulDeletion: boolean = relationTypeDao.deleteRelationType(relationTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const subAfterDelete: RelationType = relationTypeDao.getRelationTypeByLabel(subRelationTypeLabel);
        expect(relationTypeDao.getRootRelationTypes()).toContainEqual(subAfterDelete);
    })

    it('Delete Relation Type which does not exist should return false', () => {
        const nonExistentRelationTypetId: string = IdGenerator.getInstance().getNextUniqueRelationTypeId();

        const isSuccessfulDeletion: boolean = relationTypeDao.deleteRelationType(nonExistentRelationTypetId);

        expect(isSuccessfulDeletion).toBe(false);
    })

    xit('Delete All Sub Relation Types Recursively (Cascade)', () => {
    })

    it('Generate relation type hierarchy from JSON structure', () => {
        const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
        const hierarchyToGenerate: SimpleRelationType[] = [
            {
                label: "Link",
                signature: [entityConceptTypeLabel],
                subRelationTypes: [
                    {
                        label: "RelatedWith",
                        signature: [subEntityConceptTypeLabel],
                        subRelationTypes: [
                            {
                                label: "SiblingOf",
                                signature: [subSubEntityConceptTypeLabel],
                                subRelationTypes: [
                                    {
                                        label: "SisterOf",
                                        signature: [subSubEntityConceptTypeLabel],
                                    },
                                    {
                                        label: "BrotherOf",
                                        signature: [subSubEntityConceptTypeLabel],
                                    }
                                ]
                            }, {
                                label: "AncestorOf",
                                signature: [subSubEntityConceptTypeLabel],
                                subRelationTypes: [
                                    {
                                        label: "ParentOf",
                                        signature: [subSubEntityConceptTypeLabel],
                                        subRelationTypes: [
                                            {
                                                label: "MotherOf",
                                                signature: [subSubEntityConceptTypeLabel],
                                            },
                                            {
                                                label: "FatherOf",
                                                signature: [subSubEntityConceptTypeLabel],
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                label: "ChildOf",
                                signature: [subEntityConceptTypeLabel],
                            }, {
                                label: "MarriedTo",
                                signature: [subEntityConceptTypeLabel],
                            }
                        ]
                    },
                    {
                        label: "Dislike",
                        signature: [subEntityConceptTypeLabel],
                    },
                    {
                        label: "Like",
                        signature: [subEntityConceptTypeLabel],
                    }
                ]
            }
        ];

        relationTypeDao.importHierarchyFromSimpleRelationTypes(hierarchyToGenerate);
        const rootRelationTypes: RelationType[] = relationTypeDao.getRootRelationTypes();
        const linkWithRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Link");
        expect(rootRelationTypes).toContainEqual(linkWithRelationType);

        const relatedWithRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("RelatedWith");
        const dislikeRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Dislike");
        const likeRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Like");
        const siblingOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("SiblingOf");
        const ancesterOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("AncestorOf");
        const sisterOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("SisterOf");
        const brotherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("BrotherOf");
        const parentOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("ParentOf");
        const motherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("MotherOf");
        const fatherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("FatherOf");
        const childOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("ChildOf");
        const marriedToRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("MarriedTo");

        // Assert parent ids
        expect(relatedWithRelationType.parentRelationTypeLabels[0]).toBe(linkWithRelationType.label);
        expect(dislikeRelationType.parentRelationTypeLabels[0]).toBe(linkWithRelationType.label);
        expect(likeRelationType.parentRelationTypeLabels[0]).toBe(linkWithRelationType.label);

        expect(siblingOfRelationType.parentRelationTypeLabels[0]).toBe(relatedWithRelationType.label);
        expect(ancesterOfRelationType.parentRelationTypeLabels[0]).toBe(relatedWithRelationType.label);
        expect(childOfRelationType.parentRelationTypeLabels[0]).toBe(relatedWithRelationType.label);
        expect(marriedToRelationType.parentRelationTypeLabels[0]).toBe(relatedWithRelationType.label);

        expect(sisterOfRelationType.parentRelationTypeLabels[0]).toBe(siblingOfRelationType.label);
        expect(brotherOfRelationType.parentRelationTypeLabels[0]).toBe(siblingOfRelationType.label);
        expect(parentOfRelationType.parentRelationTypeLabels[0]).toBe(ancesterOfRelationType.label);
        expect(motherOfRelationType.parentRelationTypeLabels[0]).toBe(parentOfRelationType.label);
        expect(fatherOfRelationType.parentRelationTypeLabels[0]).toBe(parentOfRelationType.label);

        // Assert sub ids
        expect(linkWithRelationType.subRelationTypeLabels).toEqual([
            relatedWithRelationType.label, dislikeRelationType.label, likeRelationType.label
        ]);
        expect(relatedWithRelationType.subRelationTypeLabels).toEqual([
            siblingOfRelationType.label, ancesterOfRelationType.label, childOfRelationType.label, marriedToRelationType.label
        ]);
        expect(siblingOfRelationType.subRelationTypeLabels).toEqual([sisterOfRelationType.label, brotherOfRelationType.label]);
        expect(ancesterOfRelationType.subRelationTypeLabels).toEqual([parentOfRelationType.label]);
        expect(parentOfRelationType.subRelationTypeLabels).toEqual([motherOfRelationType.label, fatherOfRelationType.label]);

    })

})