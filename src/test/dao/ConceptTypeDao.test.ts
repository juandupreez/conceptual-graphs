import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";


describe('ConceptTypeDao basic tests', () => {

    it('insert then get concept type', () => {
        const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

        const conceptType: ConceptType = new ConceptType();
        conceptType.description = "Entity";
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
        parentConceptType.description = "Entity";
        const parentGeneratedId: string = conceptTypeDao.insertConceptTypeAtRoot(parentConceptType);

        const subConceptType: ConceptType = new ConceptType();
        subConceptType.description = "Sub-entity";
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
                description: "Entity",
                subConceptTypes: [
                    {
                        description: "Human",
                        subConceptTypes: [
                            {
                                description: "Adult",
                                subConceptTypes: [
                                    { description: "Woman" },
                                    { description: "Man" }
                                ]
                            }, {
                                description: "Female",
                                subConceptTypes: [
                                    { description: "Woman" },
                                    { description: "Girl" }
                                ]
                            }, {
                                description: "Child",
                                subConceptTypes: [
                                    { description: "Girl" },
                                    { description: "Boy" }
                                ]
                            }, {
                                description: "Male",
                                subConceptTypes: [
                                    { description: "Man" },
                                    { description: "Boy" }
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
        expect(rootConceptTypes[0].description).toBe("Entity");

        const humanConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Human");
        const adultConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Adult");
        const femaleConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Female");
        const childConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Child");
        const maleConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Male");
        const womanConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Woman");
        const manConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Man");
        const girlConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Girl");
        const boyConceptType: ConceptType = conceptTypeDao.getConceptTypeByDescription("Boy");

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

})