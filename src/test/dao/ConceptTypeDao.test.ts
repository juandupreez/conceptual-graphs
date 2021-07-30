import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { Concept } from "../../main/domain/Concept";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

describe('ConceptTypeDao basic tests', () => {

    it('Create Concept type at root', () => {
        const conceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType1");
        expect(conceptType.id).not.toBeNull();
        expect(conceptType).toEqual({
            id: conceptType.id,
            label: "RootConceptType1",
            parentConceptTypeIds: [],
            subConceptTypeIds: []
        });
    })

    it('Create Concept type as child', () => {
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType2");
        const subConceptType: ConceptType = conceptTypeDao.createConceptType("SubConceptType1", ["RootConceptType2"]);
        rootConceptType = conceptTypeDao.getConceptTypeByLabel("RootConceptType2");
        expect(rootConceptType.subConceptTypeIds).toEqual([subConceptType.id]);
        expect(subConceptType.id).not.toBeNull();
        expect(subConceptType).toEqual({
            id: subConceptType.id,
            label: "SubConceptType1",
            parentConceptTypeIds: [rootConceptType.id],
            subConceptTypeIds: []
        });
    })

    it('Error: Create Concept type with non-existent parent should throw error', () => {
        expect(() => conceptTypeDao.createConceptType("SubConceptType2", ["RootConceptType3"]))
            .toThrow("Could not create concept 'SubConceptType2'. No parent concept type with label: 'RootConceptType3'.");
    })

    it('Error: Create Duplicate Concept type should throw error', () => {
        let rootConceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType4");
        const subConceptType: ConceptType = conceptTypeDao.createConceptType("SubConceptType3", ["RootConceptType4"]);
        expect(() => conceptTypeDao.createConceptType("SubConceptType3", ["RootConceptType4"]))
            .toThrow("Could not create concept 'SubConceptType3'. A concept with that label already exists.");
    })

    it('Insert concept type at root then get by id', () => {
        const conceptType: ConceptType = new ConceptType();
        conceptType.label = "Entity1";
        const savedConceptType: ConceptType = conceptTypeDao.insertConceptTypeAtRoot(conceptType);

        const gottenConceptType: ConceptType = conceptTypeDao.getConceptTypeById(savedConceptType.id);
        expect(savedConceptType).toEqual(gottenConceptType);
    })

    it('Error: insert concept type at root with given id should throw error', () => {
        const conceptType: ConceptType = new ConceptType();
        conceptType.id = "cutom_made_id";
        conceptType.label = "Entity2";
        expect(() => conceptTypeDao.insertConceptTypeAtRoot(conceptType))
            .toThrow("Cannot create concept. Expected id to be null but instead it was: 'cutom_made_id'");
    })

    it('Error: insert duplicate concept type should throw error', () => {
        const conceptType: ConceptType = new ConceptType();
        conceptType.label = "Entity3";
        const conceptTypeDuplicate: ConceptType = { ...conceptType };
        const savedConceptType: ConceptType = conceptTypeDao.insertConceptTypeAtRoot(conceptType);
        expect(() => conceptTypeDao.insertConceptTypeAtRoot(conceptTypeDuplicate))
            .toThrow("Could not create concept 'Entity3'. A concept with that label already exists.");
    })

    it('insert concept type as child of parent', () => {
        const parentConceptType: ConceptType = new ConceptType();
        parentConceptType.label = "Entity4";
        const savedConceptType1: ConceptType = conceptTypeDao.insertConceptTypeAtRoot(parentConceptType);

        const subConceptType: ConceptType = new ConceptType();
        subConceptType.label = "Sub-entity4";
        const savedConceptType2: ConceptType = conceptTypeDao.insertConceptTypeAsSubtype(subConceptType, parentConceptType);

        const savedParentConceptType: ConceptType = conceptTypeDao.getConceptTypeById(savedConceptType1.id);
        expect(savedParentConceptType).toEqual({
            ...parentConceptType,
            subConceptTypeIds: [savedConceptType2.id]
        });

        const savedSubConceptType: ConceptType = conceptTypeDao.getConceptTypeById(savedConceptType2.id);
        expect(savedSubConceptType).toEqual({
            ...subConceptType,
            parentConceptTypeIds: [savedConceptType1.id]
        });

    })

    it('Error: insert concept type as subtype with given id should throw error', () => {
        const parentConceptType: ConceptType = new ConceptType();
        parentConceptType.label = "Entity5";
        const savedParentConceptType: ConceptType = conceptTypeDao.insertConceptTypeAtRoot(parentConceptType);

        const conceptType: ConceptType = new ConceptType();
        conceptType.id = "cutom_made_id";
        conceptType.label = "SubEntity5";
        expect(() => conceptTypeDao.insertConceptTypeAsSubtype(conceptType, savedParentConceptType))
            .toThrow("Cannot create concept. Expected id to be null but instead it was: 'cutom_made_id'");
    })

    it('Error: insert duplicate concept type as subtype should throw error', () => {
        const parentConceptType: ConceptType = new ConceptType();
        parentConceptType.label = "Entity6";
        const savedParentConceptType: ConceptType = conceptTypeDao.insertConceptTypeAtRoot(parentConceptType);

        const conceptType: ConceptType = new ConceptType();
        conceptType.label = "SubEntity6";
        const conceptTypeDuplicate: ConceptType = { ...conceptType };
        const savedConceptType: ConceptType = conceptTypeDao.insertConceptTypeAsSubtype(conceptType, savedParentConceptType);
        expect(() => conceptTypeDao.insertConceptTypeAtRoot(conceptTypeDuplicate))
            .toThrow("Could not create concept 'SubEntity6'. A concept with that label already exists.");
    })

    it('Generate concept type hierarchy from JSON structure', () => {
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

        conceptTypeDao.generateHierarchyFromObject(hierarchyToGenerate);
        const rootConceptTypes: ConceptType[] = conceptTypeDao.getRootConceptTypes();
        const entityConceptType: ConceptType = conceptTypeDao.getConceptTypeByLabel("Entity");
        expect(rootConceptTypes).toContain(entityConceptType);

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
        expect(humanConceptType.parentConceptTypeIds[0]).toBe(entityConceptType.id);
        expect(adultConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(femaleConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(childConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(maleConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);

        expect(womanConceptType.parentConceptTypeIds).toEqual([adultConceptType.id, femaleConceptType.id]);
        expect(manConceptType.parentConceptTypeIds).toEqual([adultConceptType.id, maleConceptType.id]);
        expect(girlConceptType.parentConceptTypeIds).toEqual([femaleConceptType.id, childConceptType.id]);
        expect(boyConceptType.parentConceptTypeIds).toEqual([childConceptType.id, maleConceptType.id]);

        // Assert sub ids
        expect(entityConceptType.subConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(humanConceptType.subConceptTypeIds).toEqual([
            adultConceptType.id, femaleConceptType.id, childConceptType.id, maleConceptType.id
        ]);
        expect(adultConceptType.subConceptTypeIds).toEqual([womanConceptType.id, manConceptType.id]);
        expect(femaleConceptType.subConceptTypeIds).toEqual([womanConceptType.id, girlConceptType.id]);
        expect(childConceptType.subConceptTypeIds).toEqual([girlConceptType.id, boyConceptType.id]);
        expect(maleConceptType.subConceptTypeIds).toEqual([manConceptType.id, boyConceptType.id]);

    })

})