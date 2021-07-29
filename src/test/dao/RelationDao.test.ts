import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Relation } from "../../main/domain/Relation"
import { RelationType } from "../../main/domain/RelationType";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptDao } from "../../main/dao/ConceptDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { Concept } from "../../main/domain/Concept";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);

describe('RelationDao basic tests', () => {

    it('create a relation', () => {
        const relationDao: RelationDao = new InMemoryRelationDao(relationTypeDao);
        const rootConceptType: ConceptType = conceptTypeDao.createConceptType("RootConceptType");
        const rootRelationType: RelationType = relationTypeDao.createRelationType("RootRelationType", [rootConceptType.label]);
        const concept: Concept = conceptDao.createConcept("NewConcept", rootConceptType.label, "TextReferent");
        const relation: Relation = relationDao.createRelation("NewRelation", rootRelationType.label, [concept.label]);
        expect(relation.id).not.toBeNull();
        expect(relation).toEqual({
            id: relation.id,
            label: "NewRelation",
            relationTypeLabels: ["RootRelationType"],
            conceptArguments: [
                "NewConcept"
            ]
        });
    })

})