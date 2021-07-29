import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Concept } from "../../main/domain/Concept";
import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao();
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryConceptDao(conceptTypeDao);

describe('ConceptualGraph', () => {

    it('Add single concept', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptTypeDao.createConceptType("Entity");
        const singleConcept: Concept = conceptDao.createConcept("NewConcept", "Entity", "Referent");

        conceptualGraph.addConcept(singleConcept);
    })

    it('Add single concept and single relation', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();

        const singleConcept: Concept = new Concept();
        singleConcept.id = "C1";
        singleConcept.conceptType = new ConceptType();
        singleConcept.conceptType.id = "1";
        singleConcept.conceptType.label = "Entity";
        singleConcept.referent = "SingleConcept";

        const singleRelation: Relation = new Relation();
        singleRelation.id = "R1";
        singleRelation.relationType = new RelationType();
        singleRelation.relationType.label = "Link";
        singleRelation.relationType.signature = ["1"];

        conceptualGraph.addConcept(singleConcept);
        conceptualGraph.addRelation(singleRelation, [singleConcept]);

        expect(conceptualGraph.concepts).toEqual([singleConcept]);
        expect(conceptualGraph.relations).toEqual([singleRelation]);
        expect(conceptualGraph.edges).toEqual([{
            conceptId: "C1",
            relationId: "R1",
            isFromConceptToRelation: true
        }]);
    })

    it('The cat is on the mat 1', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity",
            subConceptTypes: [
                { label: "Cat" },
                { label: "Mat" }
            ]
        }]
        conceptTypeDao.generateHierarchyFromObject(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "Link",
            subRelationTypes: [{ label: "On" }]
        }]
        relationTypeDao.generateHierarchyFromObject(relationTypeHierarchy);

        const catConcept: Concept = conceptDao.createConcept("TheCat", "Cat", "The");
        conceptualGraph.addConcept(catConcept);
        const matConcept: Concept = conceptDao.createConcept("TheMat", "Mat", "The");
        conceptualGraph.addConcept(matConcept);
        const onRelation: Relation = relationDao.createRelation("OnThe", "On", [catConcept, matConcept]);
        conceptualGraph.addRelation(onRelation, [catConcept, matConcept]);
    })

    it('The cat is on the mat 2', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity",
            subConceptTypes: [
                { label: "Cat" },
                { label: "Mat" }
            ]
        }]
        conceptTypeDao.generateHierarchyFromObject(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "Link",
            subRelationTypes: [{ label: "On" }]
        }]
        relationTypeDao.generateHierarchyFromObject(relationTypeHierarchy);

        const catConcept: Concept = conceptualGraph.createConcept("TheCat", "Cat", "The");
        const matConcept: Concept = conceptualGraph.createConcept("TheMat", "Mat", "The");
        const onRelation: Concept = conceptualGraph.createRelation("OnThe", "On", [catConcept, matConcept]);

        // const catConcept: Concept = conceptDao.createConcept("TheCat", "Cat", "The");
        // conceptualGraph.addConcept(catConcept);
        // const matConcept: Concept = conceptDao.createConcept("TheMat", "Mat", "The");
        // conceptualGraph.addConcept(matConcept);
        // const onRelation: Relation = relationDao.createRelation("OnThe", "On", [catConcept, matConcept]);
        // conceptualGraph.addRelation(onRelation, [catConcept, matConcept]);
    })

})