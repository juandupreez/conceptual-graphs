import { Concept } from "../../domain/Concept";
import { ConceptualGraph } from "../../domain/ConceptualGraph";
import { Relation } from "../../domain/Relation";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { ConceptualGraphDao } from "../ConceptualGraphDao";
import { RelationDao } from "../RelationDao";
import { Store } from "./store/Store";

export class SimpleConceptualGraph {
    id?: string;
    label: string;
    conceptLabels: string[] = [];
    relationLabels: string[] = [];
}
export class InMemoryConceptualGraphDao implements ConceptualGraphDao {
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    simpleConceptualGraphs: SimpleConceptualGraph[] = Store.getInstance().state.simpleConceptualGarphs;

    constructor(conceptDao: ConceptDao, relationDao: RelationDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
    }

    createConceptualGraph(conceptualGraph: ConceptualGraph): ConceptualGraph {
        const createdConceptualGraph = new ConceptualGraph();
        const simpleConceptualGraph = new SimpleConceptualGraph();
        const generatedId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        conceptualGraph.id = generatedId;
        createdConceptualGraph.id = generatedId;
        simpleConceptualGraph.id = generatedId;
        createdConceptualGraph.label = conceptualGraph.label;
        simpleConceptualGraph.label = conceptualGraph.label;
        conceptualGraph.concepts.forEach((singleConcept: Concept) => {
            const createdConcept: Concept
                = this.conceptDao.createConcept(singleConcept.label, singleConcept.conceptTypeLabels, singleConcept.referent);
            createdConceptualGraph.concepts.push(createdConcept);
            simpleConceptualGraph.conceptLabels.push(createdConcept.label);
        })
        conceptualGraph.relations.forEach((singleRelation: Relation) => {
            const createdRelation: Relation
                = this.relationDao.createRelation(singleRelation.label, singleRelation.relationTypeLabels, singleRelation.conceptArgumentLabels);
            createdConceptualGraph.relations.push(createdRelation);
            simpleConceptualGraph.relationLabels.push(singleRelation.label);
        })
        this.simpleConceptualGraphs.push(simpleConceptualGraph);
        return createdConceptualGraph;
    }

    getConceptualGraphById(conceptualGraphId: string): ConceptualGraph {
        const foundSimpleConceptualGraph: SimpleConceptualGraph = this.simpleConceptualGraphs.find((singleSimpleConceptualGraph) => {
            return (singleSimpleConceptualGraph.id && singleSimpleConceptualGraph.id === conceptualGraphId);
        })
        if (!foundSimpleConceptualGraph) {
            return undefined;
        } else {
            const conceptualGraph: ConceptualGraph = new ConceptualGraph();
            conceptualGraph.id = foundSimpleConceptualGraph.id;
            conceptualGraph.label = foundSimpleConceptualGraph.label;
            foundSimpleConceptualGraph.conceptLabels.forEach((singleConceptLabel) => {
                conceptualGraph.addConcept(this.conceptDao.getConceptByLabel(singleConceptLabel))
            })
            foundSimpleConceptualGraph.relationLabels.forEach((singleRelationLabel) => {
                const singleRelation: Relation =  this.relationDao.getRelationByLabel(singleRelationLabel)
                conceptualGraph.addRelation(singleRelation)
            })
            return conceptualGraph;
        }
    }

}