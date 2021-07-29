import { Concept } from "../../domain/Concept";
import { ConceptRelationEdge } from "../../domain/ConceptRelationEdge";
import { ConceptualGraph } from "../../domain/ConceptualGraph";
import { Relation } from "../../domain/Relation";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { ConceptualGraphDao } from "../ConceptualGraphDao";
import { RelationDao } from "../RelationDao";
import { Store } from "./store/Store";

export class InMemoryConceptualGraphDao implements ConceptualGraphDao {
    conceptDao: ConceptDao;
    relationDao: RelationDao;

    constructor(conceptDao: ConceptDao, relationDao: RelationDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
    }

    insertConceptualGraph(conceptualGraph: ConceptualGraph): ConceptualGraph {
        const generatedId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        conceptualGraph.id = generatedId;
        conceptualGraph.concepts.forEach((singleConcept: Concept) => {
            if (!singleConcept.id) {
                singleConcept.id = {
                    conceptId: null,
                    conceptualGraphId: null
                }
            }
            singleConcept.id.conceptualGraphId = generatedId;
            this.conceptDao.insertConcept(singleConcept);
        })
        conceptualGraph.relations.forEach((singleRelation: Relation) => {
            if (!singleRelation.id) {
                singleRelation.id = {
                    relationId: null,
                    conceptualGraphId: null
                }
            }
            singleRelation.id.conceptualGraphId = generatedId;
            this.relationDao.insertRelation(singleRelation);
        })
        conceptualGraph.edges.forEach((singleEdge: ConceptRelationEdge) => {
            if (!singleEdge.id) {
                singleEdge.id = {
                    edgeId: null,
                    conceptualGraphId: null
                }
            }
            singleEdge.id.conceptualGraphId = generatedId;
            Store.getInstance().state.edges.push(singleEdge);
        })
        return conceptualGraph;
    }

}