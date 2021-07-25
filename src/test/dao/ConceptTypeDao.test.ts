import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

describe('ConceptTypeDao basic tests', () => {

    it('insert then get concept type', () => {

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

})