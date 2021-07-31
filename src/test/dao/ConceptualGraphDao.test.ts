import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Concept } from "../../main/domain/Concept";
import { Relation } from "../../main/domain/Relation";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { InMemoryConceptualGraphDao } from "../../main/dao/inmemory/InMemoryConceptualGraphDao";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(relationTypeDao);
const conceptualGraphDao: ConceptualGraphDao = new InMemoryConceptualGraphDao(conceptDao, relationDao);

describe('ConceptualGraphDao', () => {

    it('Create simple conceptual graph: The cat is on the mat', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity",
            subConceptTypes: [
                { label: "Cat" },
                { label: "Mat" }
            ]
        }]
        conceptTypeDao.importHierarchyFromSimpleConceptTypes(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "Link",
            subRelationTypes: [{ label: "On" }]
        }]
        relationTypeDao.generateHierarchyFromObject(relationTypeHierarchy);

        const catConcept: Concept = conceptualGraph.createConcept("TheCat", "Cat", "The");
        const matConcept: Concept = conceptualGraph.createConcept("TheMat", "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation("OnThe", "On", [catConcept, matConcept]);

        conceptualGraphDao.insertConceptualGraph(conceptualGraph);

        console.log(conceptualGraph);
        
    })

})