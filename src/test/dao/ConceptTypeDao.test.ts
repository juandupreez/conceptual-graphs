import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

const testRootConceptTypeLabelPrefix1: string = 'TestRootConcept1-';
const testRootConceptTypeLabelPrefix2: string = 'TestRootConcept2-';
const testRootConceptTypeLabelPrefix3: string = 'TestRootConcept3-';
const testSubConceptTypeLabelPrefix1: string = 'TestSubConcept1-';
const testSubConceptTypeLabelPrefix2: string = 'TestSubConcept2-';
const testSubSubConceptTypeLabelPrefix1: string = 'TestSubSubConcept1-';
const testSubSubConceptTypeLabelPrefix2: string = 'TestSubSubConcept2-';

describe('ConceptTypeDao basic tests', () => {

    it('Create Concept Type at root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;

        const conceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);

        expect(conceptType.id).not.toBeNull();
        expect(conceptType).toEqual({
            id: conceptType.id,
            label: testRootConceptTypeLabel,
            parentConceptTypeLabels: [],
            subConceptTypeLabels: []
        });
    })

    it('Create Concept Type as child of single existing parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const existingParentConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const newSubConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType(existingParentConceptTypeLabel);

        const subConceptType: ConceptType = conceptTypeDao.createConceptType(newSubConceptTypeLabel, [existingParentConceptTypeLabel]);

        rootConceptType = conceptTypeDao.getConceptTypeByLabel(existingParentConceptTypeLabel);
        expect(rootConceptType.subConceptTypeLabels).toEqual([subConceptType.label]);
        expect(subConceptType.id).not.toBeNull();
        expect(subConceptType).toEqual({
            id: subConceptType.id,
            label: newSubConceptTypeLabel,
            parentConceptTypeLabels: [existingParentConceptTypeLabel],
            subConceptTypeLabels: []
        });
    })

    it('Create Concept Type as child of two existing parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const existingParentConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const existingParentConceptTypeLabel2: string = testRootConceptTypeLabelPrefix2 + testId;
        const newSubConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        let rootConceptType1: ConceptType = conceptTypeDao.createConceptType(existingParentConceptTypeLabel1);
        let rootConceptType2: ConceptType = conceptTypeDao.createConceptType(existingParentConceptTypeLabel2);

        const subConceptType: ConceptType = conceptTypeDao.createConceptType(newSubConceptTypeLabel,
            [existingParentConceptTypeLabel1, existingParentConceptTypeLabel2]);

        rootConceptType1 = conceptTypeDao.getConceptTypeByLabel(existingParentConceptTypeLabel1);
        rootConceptType2 = conceptTypeDao.getConceptTypeByLabel(existingParentConceptTypeLabel2);
        expect(rootConceptType1.subConceptTypeLabels).toEqual([subConceptType.label]);
        expect(rootConceptType2.subConceptTypeLabels).toEqual([subConceptType.label]);
        expect(subConceptType.id).not.toBeNull();
        expect(subConceptType).toEqual({
            id: subConceptType.id,
            label: newSubConceptTypeLabel,
            parentConceptTypeLabels: [existingParentConceptTypeLabel1, existingParentConceptTypeLabel2],
            subConceptTypeLabels: []
        });
    })

    it('Create Concept Type should return transient object', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;

        const createdConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);
        createdConceptType.label = "SomethingElse";
        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(testRootConceptTypeLabel);

        expect(createdConceptType).not.toEqual(savedConceptType);
    })

    it('Error: Create Concept Type with non-existent parent should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const nonExistentparentConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const newSubConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;

        expect(() => conceptTypeDao.createConceptType(newSubConceptTypeLabel, [nonExistentparentConceptTypeLabel]))
            .toThrow(`Could not create concept '${newSubConceptTypeLabel}'. No parent concept type with label: '${nonExistentparentConceptTypeLabel}'.`);
    })

    it('Error: Create Duplicate Root Concept Type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);

        expect(() => conceptTypeDao.createConceptType(testRootConceptTypeLabel))
            .toThrow(`Could not create concept '${testRootConceptTypeLabel}'. A concept with that label already exists.`);
    })

    it('Error: Create Duplicate Sub Concept Type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const newSubConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);
        let existingConceptType: ConceptType = conceptTypeDao.createConceptType(newSubConceptTypeLabel, [testRootConceptTypeLabel]);

        expect(() => conceptTypeDao.createConceptType(newSubConceptTypeLabel, [testRootConceptTypeLabel]))
            .toThrow(`Could not create concept '${newSubConceptTypeLabel}'. A concept with that label already exists.`);
    })

    it('Error: Create Concept Type with parent as itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);

        expect(() => conceptTypeDao.createConceptType(testRootConceptTypeLabel, [testRootConceptTypeLabel]))
            .toThrow(`Could not create concept '${testRootConceptTypeLabel}'. A concept cannot reference itself as parent`);
    })

    it('Get Concept Type by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        let createdConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);
        let gottenConceptType: ConceptType = conceptTypeDao.getConceptTypeById(createdConceptType.id);
        expect(createdConceptType).toEqual(gottenConceptType);
    })

    it('Get Concept Type by label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        let createdConceptType: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel);
        let gottenConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(testRootConceptTypeLabel);
        expect(createdConceptType).toEqual(gottenConceptType);
    })

    it('Get Root Concept Types', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const testRootConceptTypeLabel2: string = testRootConceptTypeLabelPrefix2 + testId;
        const testRootConceptTypeLabel3: string = testRootConceptTypeLabelPrefix3 + testId;
        let rootConceptType1: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel1);
        let rootConceptType2: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel2);
        let rootConceptType3: ConceptType = conceptTypeDao.createConceptType(testRootConceptTypeLabel3);
        let rootConceptTypes: ConceptType[] = conceptTypeDao.getRootConceptTypes();
        expect(rootConceptTypes).toContainEqual(rootConceptType1);
        expect(rootConceptTypes).toContainEqual(rootConceptType2);
        expect(rootConceptTypes).toContainEqual(rootConceptType3);
    })

    it('Error: Get Concept Type by Id when none exist should return undefined', () => {
        const testConceptTypeId: string = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        const rootConceptType: ConceptType = conceptTypeDao.getConceptTypeById(testConceptTypeId);
        expect(rootConceptType).toBeUndefined();
    })

    it('Error: Get Concept Type by label when none exist should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const testRootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const rootConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(testRootConceptTypeLabel1);
        expect(rootConceptType).toBeUndefined();
    })

    it('Update Root Concept Type label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const originalConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId + '-old';
        const newConceptTypeLabel: string = testRootConceptTypeLabelPrefix2 + testId + '-new';
        const createdConceptType: ConceptType = conceptTypeDao.createConceptType(originalConceptTypeLabel);
        const conceptTypeToUpdate: ConceptType = { ...createdConceptType, label: newConceptTypeLabel };

        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(newConceptTypeLabel);
        expect(updatedConceptType).toEqual(savedConceptType);
        expect(updatedConceptType).not.toEqual(createdConceptType);
    })

    it('Update Sub Concept Type label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const oldConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId + '-old';
        const newConceptTypeLabel: string = testSubConceptTypeLabelPrefix2 + testId + '-new';
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const createdConceptType: ConceptType = conceptTypeDao.createConceptType(oldConceptTypeLabel, [rootConceptTypeLabel]);
        const conceptTypeToUpdate: ConceptType = { ...createdConceptType, label: newConceptTypeLabel };

        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(newConceptTypeLabel);
        expect(updatedConceptType).toEqual(savedConceptType);
        expect(updatedConceptType).not.toEqual(createdConceptType);
    })

    it('Update Concept Type label should update parent and sub concept types', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const oldConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId + '-old';
        const newConceptTypeLabel: string = testSubConceptTypeLabelPrefix2 + testId + '-new';
        const subSubConceptTypeLabel: string = testSubSubConceptTypeLabelPrefix1 + testId;
        const oldRootConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const createdConceptType: ConceptType = conceptTypeDao.createConceptType(oldConceptTypeLabel, [rootConceptTypeLabel]);
        const oldSubSubConceptType: ConceptType = conceptTypeDao.createConceptType(subSubConceptTypeLabel, [oldConceptTypeLabel]);
        const conceptTypeToUpdate: ConceptType = { ...createdConceptType, label: newConceptTypeLabel };

        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const newRootConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(rootConceptTypeLabel);
        const newSubSubConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(subSubConceptTypeLabel);
        expect(newRootConceptType.subConceptTypeLabels[0]).toBe(newConceptTypeLabel);
        expect(newSubSubConceptType.parentConceptTypeLabels[0]).toBe(newConceptTypeLabel);
    })

    it('Update Concept Type structure to add parent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            parentConceptTypeLabels: [...conceptTypeToUpdate.parentConceptTypeLabels]
        };

        conceptTypeToUpdate.parentConceptTypeLabels.push(rootConceptTypeLabel);
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(updatedConceptType).toEqual(savedConceptType);
        expect(updatedConceptType).not.toEqual(originalConceptTypeToUpdate);
        expect(updatedConceptType).toEqual({
            ...originalConceptTypeToUpdate,
            parentConceptTypeLabels: [rootConceptTypeLabel]
        });
        const newRootConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(rootConceptTypeLabel);
        expect(newRootConceptType).not.toEqual(rootConceptType);
        expect(newRootConceptType).toEqual({
            ...rootConceptType,
            subConceptTypeLabels: [subConceptTypeLabel]
        });
    })

    it('Update Concept Type structure to add parent and remove from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            parentConceptTypeLabels: [...conceptTypeToUpdate.parentConceptTypeLabels]
        };
        expect(conceptTypeDao.getRootConceptTypes()).toContainEqual(conceptTypeToUpdate);

        conceptTypeToUpdate.parentConceptTypeLabels.push(rootConceptTypeLabel);
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);
        expect(conceptTypeDao.getRootConceptTypes()).not.toContainEqual(conceptTypeToUpdate);
    })

    it('Update Concept Type structure to remove parent but not move to root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const rootConceptTypeLabel2: string = testRootConceptTypeLabelPrefix2 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const rootConceptType1: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel1);
        const rootConceptType2: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel2);
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel1, rootConceptTypeLabel2]);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            parentConceptTypeLabels: [...conceptTypeToUpdate.parentConceptTypeLabels]
        };

        conceptTypeToUpdate.parentConceptTypeLabels = [rootConceptTypeLabel1];
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);
        expect(conceptTypeDao.getRootConceptTypes()).not.toContainEqual(conceptTypeToUpdate);
    })

    it('Update Concept Type structure to remove parent and move to root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const rootConceptType1: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel1);
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel1]);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            parentConceptTypeLabels: [...conceptTypeToUpdate.parentConceptTypeLabels]
        };

        conceptTypeToUpdate.parentConceptTypeLabels = [];
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);
        expect(conceptTypeDao.getRootConceptTypes()).toContainEqual(conceptTypeToUpdate);
    })

    it('Update Concept Type structure to add child', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const subConceptType: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            subConceptTypeLabels: [...conceptTypeToUpdate.subConceptTypeLabels]
        };

        conceptTypeToUpdate.subConceptTypeLabels.push(subConceptTypeLabel);
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(rootConceptTypeLabel);
        expect(updatedConceptType).toEqual(savedConceptType);
        expect(updatedConceptType).not.toEqual(originalConceptTypeToUpdate);
        expect(updatedConceptType).toEqual({
            ...originalConceptTypeToUpdate,
            subConceptTypeLabels: [subConceptTypeLabel]
        });
        const newSubConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(newSubConceptType).not.toEqual(subConceptType);
        expect(newSubConceptType).toEqual({
            ...subConceptType,
            parentConceptTypeLabels: [rootConceptTypeLabel]
        });
    })

    it('Update Concept Type structure to add child and remove child from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const subConceptType: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            subConceptTypeLabels: [...conceptTypeToUpdate.subConceptTypeLabels]
        };
        expect(conceptTypeDao.getRootConceptTypes()).toContainEqual(subConceptType);

        conceptTypeToUpdate.subConceptTypeLabels.push(subConceptTypeLabel);
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedSubConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(conceptTypeDao.getRootConceptTypes()).not.toContainEqual(savedSubConceptType);
    })

    it('Update Concept Type structure to remove child should add child to root if it has no other parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const subConceptType: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel]);
        const originalConceptTypeToUpdate: ConceptType = {
            ...conceptTypeToUpdate,
            subConceptTypeLabels: [...conceptTypeToUpdate.subConceptTypeLabels]
        };
        expect(conceptTypeDao.getRootConceptTypes()).not.toContainEqual(subConceptType);

        conceptTypeToUpdate.subConceptTypeLabels = [];
        const updatedConceptType: ConceptType = conceptTypeDao.updateConceptType(conceptTypeToUpdate);

        const savedSubConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(conceptTypeDao.getRootConceptTypes()).toContainEqual(savedSubConceptType);
    })

    it('Error: Update Concept Type with no id should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        conceptTypeToUpdate.id = undefined;

        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. Id is ${conceptTypeToUpdate.id}.`)
    })

    it('Error: Update Concept Type label to something that already exists should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const rootConceptTypeLabel2: string = testRootConceptTypeLabelPrefix2 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel1);
        const existingConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel2);
        conceptTypeToUpdate.label = rootConceptTypeLabel2;

        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. Id is ${conceptTypeToUpdate.id}. A concept type with that label already exists with id ${existingConceptType.id}`)
    })

    it('Error: Update Concept Type structure to add child which is itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel1);

        conceptTypeToUpdate.subConceptTypeLabels.push(rootConceptTypeLabel1);
        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. One of the sub concept types is listed as itself`);
    })

    it('Error: Update Concept Type structure to add parent which is itself should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel1: string = testRootConceptTypeLabelPrefix1 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel1);

        conceptTypeToUpdate.parentConceptTypeLabels.push(rootConceptTypeLabel1);
        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. One of the parent concept types is listed as itself`);
    })

    it('Error: Update Concept Type structure to point to concept type that does not exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const nonExistentConceptTypeLabel: string = testRootConceptTypeLabelPrefix2 + testId;
        const conceptTypeToUpdate: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);

        conceptTypeToUpdate.parentConceptTypeLabels.push(nonExistentConceptTypeLabel);
        conceptTypeToUpdate.subConceptTypeLabels = [];
        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. No such parent concept type: ${nonExistentConceptTypeLabel}`);

        conceptTypeToUpdate.subConceptTypeLabels.push(nonExistentConceptTypeLabel);
        conceptTypeToUpdate.parentConceptTypeLabels = [];
        expect(() => conceptTypeDao.updateConceptType(conceptTypeToUpdate))
            .toThrow(`Could not update concept type with label: ${conceptTypeToUpdate.label}. No such sub concept type: ${nonExistentConceptTypeLabel}`);
    })

    it('Delete Concept Type from root', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const conceptTypeToDelete: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);

        const isSuccessfulDeletion: boolean = conceptTypeDao.deleteConceptType(conceptTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        expect(conceptTypeDao.getConceptTypeByLabel(conceptTypeToDelete.label)).toBeUndefined();
        expect(conceptTypeDao.getRootConceptTypes()).not.toContainEqual(conceptTypeToDelete);
    })

    it('Delete Sub Concept Type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const conceptTypeToDelete: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel]);
        const rootBeforeDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(rootConceptTypeLabel);
        expect(rootBeforeDelete).toEqual({
            ...rootConceptType,
            subConceptTypeLabels: [subConceptTypeLabel]
        });

        const isSuccessfulDeletion: boolean = conceptTypeDao.deleteConceptType(conceptTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const rootAfterDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(rootConceptTypeLabel);
        expect(rootBeforeDelete).not.toEqual(rootAfterDelete);
        expect(rootAfterDelete).toEqual({
            ...rootBeforeDelete,
            subConceptTypeLabels: []
        });
    })

    it('Delete Parent Concept Type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const conceptTypeToDelete: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const subConceptType: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel]);
        const subBeforeDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(subBeforeDelete).toEqual({
            ...subConceptType,
            parentConceptTypeLabels: [rootConceptTypeLabel]
        });

        const isSuccessfulDeletion: boolean = conceptTypeDao.deleteConceptType(conceptTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const subAfterDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(subBeforeDelete).not.toEqual(subAfterDelete);
        expect(subAfterDelete).toEqual({
            ...subBeforeDelete,
            parentConceptTypeLabels: []
        });
    })

    it('Delete Parent Concept Type should move subs to root if no other parents', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const rootConceptTypeLabel: string = testRootConceptTypeLabelPrefix1 + testId;
        const subConceptTypeLabel: string = testSubConceptTypeLabelPrefix1 + testId;
        const conceptTypeToDelete: ConceptType = conceptTypeDao.createConceptType(rootConceptTypeLabel);
        const subConceptType: ConceptType = conceptTypeDao.createConceptType(subConceptTypeLabel, [rootConceptTypeLabel]);
        const subBeforeDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(subBeforeDelete).toEqual({
            ...subConceptType,
            parentConceptTypeLabels: [rootConceptTypeLabel]
        });

        const isSuccessfulDeletion: boolean = conceptTypeDao.deleteConceptType(conceptTypeToDelete.id);

        expect(isSuccessfulDeletion).toBe(true);
        const subAfterDelete: ConceptType = conceptTypeDao.getConceptTypeByLabel(subConceptTypeLabel);
        expect(conceptTypeDao.getRootConceptTypes()).toContainEqual(subAfterDelete);
    })

    it('Delete Concept Type which does not exist should return false', () => {
        const nonExistentConceptTypetId: string = IdGenerator.getInstance().getNextUniqueConceptTypeId();

        const isSuccessfulDeletion: boolean = conceptTypeDao.deleteConceptType(nonExistentConceptTypetId);

        expect(isSuccessfulDeletion).toBe(false);
    })

    xit('Delete All Sub Concept Types Recursively (Cascade)', () => {
    })

    it('Import big concept type hierarchy from JSON structure into DB', () => {
        const hierarchyToGenerate: SimpleConceptType[] = [
            {
                label: "Entity",
                subConceptTypes: [
                    {
                        label: "Human",
                        subConceptTypes: [
                            {
                                label: "Adult",
                                subConceptTypes: [
                                    { label: "Woman" },
                                    { label: "Man" }
                                ]
                            }, {
                                label: "Female",
                                subConceptTypes: [
                                    { label: "Woman" },
                                    { label: "Girl" }
                                ]
                            }, {
                                label: "Child",
                                subConceptTypes: [
                                    { label: "Girl" },
                                    { label: "Boy" }
                                ]
                            }, {
                                label: "Male",
                                subConceptTypes: [
                                    { label: "Man" },
                                    { label: "Boy" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        conceptTypeDao.importHierarchyFromSimpleConceptTypes(hierarchyToGenerate);
        const rootConceptTypes: ConceptType[] = conceptTypeDao.getRootConceptTypes();
        const entityConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Entity");
        expect(rootConceptTypes).toContainEqual(entityConceptType);

        const humanConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Human");
        const adultConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Adult");
        const femaleConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Female");
        const childConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Child");
        const maleConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Male");
        const womanConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Woman");
        const manConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Man");
        const girlConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Girl");
        const boyConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Boy");

        // Assert parent ids
        expect(humanConceptType.parentConceptTypeLabels[0]).toBe(entityConceptType.label);
        expect(adultConceptType.parentConceptTypeLabels[0]).toBe(humanConceptType.label);
        expect(femaleConceptType.parentConceptTypeLabels[0]).toBe(humanConceptType.label);
        expect(childConceptType.parentConceptTypeLabels[0]).toBe(humanConceptType.label);
        expect(maleConceptType.parentConceptTypeLabels[0]).toBe(humanConceptType.label);

        expect(womanConceptType.parentConceptTypeLabels).toEqual([adultConceptType.label, femaleConceptType.label]);
        expect(manConceptType.parentConceptTypeLabels).toEqual([adultConceptType.label, maleConceptType.label]);
        expect(girlConceptType.parentConceptTypeLabels).toEqual([femaleConceptType.label, childConceptType.label]);
        expect(boyConceptType.parentConceptTypeLabels).toEqual([childConceptType.label, maleConceptType.label]);

        // Assert sub ids
        expect(entityConceptType.subConceptTypeLabels[0]).toBe(humanConceptType.label);
        expect(humanConceptType.subConceptTypeLabels).toEqual([
            adultConceptType.label, femaleConceptType.label, childConceptType.label, maleConceptType.label
        ]);
        expect(adultConceptType.subConceptTypeLabels).toEqual([womanConceptType.label, manConceptType.label]);
        expect(femaleConceptType.subConceptTypeLabels).toEqual([womanConceptType.label, girlConceptType.label]);
        expect(childConceptType.subConceptTypeLabels).toEqual([girlConceptType.label, boyConceptType.label]);
        expect(maleConceptType.subConceptTypeLabels).toEqual([manConceptType.label, boyConceptType.label]);
    })

})