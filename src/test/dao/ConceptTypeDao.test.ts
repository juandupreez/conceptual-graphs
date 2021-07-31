import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

const testRootConceptTypeLabelPrefix1: string = 'TestRootConcept1-';
const testRootConceptTypeLabelPrefix2: string = 'TestRootConcept2-';
const testSubConceptTypeLabelPrefix1: string = 'TestSubConcept1-';
const testSubConceptTypeLabelPrefix2: string = 'TestSubConcept2-';

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

    it('Create Concept Type should create transient object', () => {
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

    it('Generate big concept type hierarchy from JSON structure', () => {
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