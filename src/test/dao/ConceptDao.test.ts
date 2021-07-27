import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { Concept } from "../../main/domain/Concept"
import { ConceptType } from "../../main/domain/ConceptType";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

describe('ConceptDao basic tests', () => {

    xit('create a concept', () => {
        const conceptDao: ConceptDao = new InMemoryConceptDao();
        const conceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType");
        const concept: Concept = conceptDao.createConcept("NewConcept", "RootConceptType", "TextReferent");
    })

})