import { ConceptType } from "../../main/ConceptType";
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

})