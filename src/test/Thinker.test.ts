import { ConceptTypeDao } from "../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../main/dao/inmemory/InMemoryConceptTypeDao";
import { ConceptType } from "../main/domain/ConceptType"

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

describe('Thinker basic tests', () => {

    it('dummy test', () => {

        const basicHierarchyObject = [
            {
                "Entity": [
                    {
                        "Human": [
                            {
                                "Adult": [
                                    "Woman",
                                    "Man"
                                ]
                            }, {
                                "Female": [
                                    "Woman",
                                    "Girl"
                                ]
                            }, {
                                "Child": [
                                    "Girl",
                                    "Boy"
                                ]
                            }, {
                                "Male": [
                                    "Man",
                                    "Boy"
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        const entityConceptType: ConceptType = new ConceptType;
        entityConceptType.description = 'Entity';
        const entityConceptTypeId: string = conceptTypeDao.insertConceptTypeAtRoot(entityConceptType);

        const humanConceptType: ConceptType = new ConceptType;
        entityConceptType.description = 'Human';
        const humanConceptTypeId: string = conceptTypeDao.insertConceptTypeAsSubtype(entityConceptType, humanConceptType);

        const adultConceptType: ConceptType = new ConceptType;
        entityConceptType.description = 'Human';
        const adultConceptTypeId: string = conceptTypeDao.insertConceptTypeAsSubtype(humanConceptType, adultConceptType);





    })

})