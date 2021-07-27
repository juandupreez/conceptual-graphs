import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { Concept } from "../../main/domain/Concept"
import { ConceptType } from "../../main/domain/ConceptType";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();

describe('ConceptDao basic tests', () => {

    it('create a concept', () => {
        const conceptDao: ConceptDao = new InMemoryConceptDao(new InMemoryConceptTypeDao);
        const conceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType");
        const concept: Concept = conceptDao.createConcept("NewConcept", "RootConceptType", "TextReferent");
        expect(concept.id).not.toBeNull();
        expect(concept).toEqual({
            id: concept.id,
            label: "NewConcept",
            conceptTypeLabels: ["RootConceptType"],
            referent: "TextReferent"
        });
    })

})