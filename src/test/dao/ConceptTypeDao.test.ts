import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";


describe('ConceptTypeDao basic tests', () => {

    it('insert then get concept type', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

        const conceptType: ConceptType = new ConceptType();
        conceptType.label = "Entity";
        const generatedId: string = conceptTypeDao.insertConceptTypeAtRoot(conceptType);

        const savedConceptType: ConceptType = conceptTypeDao.getConceptTypeById(generatedId);
        expect(savedConceptType).toEqual({
            ...conceptType,
            id: generatedId
        });

    })

    it('insert concept type as child of parent', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

        const parentConceptType: ConceptType = new ConceptType();
        parentConceptType.label = "Entity";
        const parentGeneratedId: string = conceptTypeDao.insertConceptTypeAtRoot(parentConceptType);

        const subConceptType: ConceptType = new ConceptType();
        subConceptType.label = "Sub-entity";
        const childGeneratedId: string = conceptTypeDao.insertConceptTypeAsSubtype(parentConceptType, subConceptType);

        const savedParentConceptType: ConceptType = conceptTypeDao.getConceptTypeById(parentGeneratedId);
        expect(savedParentConceptType).toEqual({
            ...parentConceptType,
            subConceptTypeIds: [childGeneratedId]
        });

        const savedSubConceptType: ConceptType = conceptTypeDao.getConceptTypeById(childGeneratedId);
        expect(savedSubConceptType).toEqual({
            ...subConceptType,
            parentConceptTypeIds: [parentGeneratedId]
        });

    })

    it('Generate concept type hierarchy from JSON structure', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
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
        expect(rootConceptTypes.length).toBe(1);
        expect(rootConceptTypes[0].label).toBe("Entity");

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
        expect(humanConceptType.parentConceptTypeIds[0]).toBe(rootConceptTypes[0].id);
        expect(adultConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(femaleConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(childConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(maleConceptType.parentConceptTypeIds[0]).toBe(humanConceptType.id);

        expect(womanConceptType.parentConceptTypeIds).toEqual([adultConceptType.id, femaleConceptType.id]);
        expect(manConceptType.parentConceptTypeIds).toEqual([adultConceptType.id, maleConceptType.id]);
        expect(girlConceptType.parentConceptTypeIds).toEqual([femaleConceptType.id, childConceptType.id]);
        expect(boyConceptType.parentConceptTypeIds).toEqual([childConceptType.id, maleConceptType.id]);

        // Assert sub ids
        expect(rootConceptTypes[0].subConceptTypeIds[0]).toBe(humanConceptType.id);
        expect(humanConceptType.subConceptTypeIds).toEqual([
            adultConceptType.id, femaleConceptType.id, childConceptType.id, maleConceptType.id
        ]);
        expect(adultConceptType.subConceptTypeIds).toEqual([womanConceptType.id, manConceptType.id]);
        expect(femaleConceptType.subConceptTypeIds).toEqual([womanConceptType.id, girlConceptType.id]);
        expect(childConceptType.subConceptTypeIds).toEqual([girlConceptType.id, boyConceptType.id]);
        expect(maleConceptType.subConceptTypeIds).toEqual([manConceptType.id, boyConceptType.id]);

    })

    it('Create Concept type at root', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
        const conceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType");
        expect(conceptType.id).not.toBeNull();
        expect(conceptType).toEqual({
            id: conceptType.id,
            label: "RootConceptType",
            parentConceptTypeIds: [],
            subConceptTypeIds: []
        });
    })

    it('Create Concept type as child', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType");
        const subConceptType: ConceptType = conceptTypeDao.createConceptType("SubConceptType", ["RootConceptType"]);
        expect(rootConceptType.subConceptTypeIds).toEqual([subConceptType.id]);
        expect(subConceptType.id).not.toBeNull();
        expect(subConceptType).toEqual({
            id: subConceptType.id,
            label: "SubConceptType",
            parentConceptTypeIds: [rootConceptType.id],
            subConceptTypeIds: []
        });
    })

})