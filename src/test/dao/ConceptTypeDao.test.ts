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
       

    })

})