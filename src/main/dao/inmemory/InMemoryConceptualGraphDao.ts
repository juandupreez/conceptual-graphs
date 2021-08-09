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
            const possibleExistingConcept: Concept = this.conceptDao.getConceptById(singleConcept.id);
            if (possibleExistingConcept) {
                const updatedConcept: Concept
                    = this.conceptDao.updateConcept(singleConcept);
                createdConceptualGraph.concepts.push(updatedConcept);
                simpleConceptualGraph.conceptLabels.push(updatedConcept.label);
            } else {
                const createdConcept: Concept
                    = this.conceptDao.createConcept(singleConcept.label, singleConcept.conceptTypeLabels, singleConcept.referent);
                createdConceptualGraph.concepts.push(createdConcept);
                simpleConceptualGraph.conceptLabels.push(createdConcept.label);
            }

        })
        conceptualGraph.relations.forEach((singleRelation: Relation) => {
            const possibleExistingRelation: Relation = this.relationDao.getRelationById(singleRelation.id);
            if (possibleExistingRelation) {
                const updatedRelation: Relation
                    = this.relationDao.updateRelation(singleRelation);
                createdConceptualGraph.relations.push(updatedRelation);
                simpleConceptualGraph.relationLabels.push(updatedRelation.label);
            } else {
                const createdRelation: Relation
                    = this.relationDao.createRelation(singleRelation.label, singleRelation.relationTypeLabels, singleRelation.conceptArgumentLabels);
                createdConceptualGraph.relations.push(createdRelation);
                simpleConceptualGraph.relationLabels.push(singleRelation.label);
            }
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
                const singleRelation: Relation = this.relationDao.getRelationByLabel(singleRelationLabel)
                conceptualGraph.addRelation(singleRelation)
            })
            return conceptualGraph;
        }
    }

    getConceptualGraphByLabel(label: string): ConceptualGraph {
        const foundSimpleConceptualGraph: SimpleConceptualGraph = this.simpleConceptualGraphs.find((singleSimpleConceptualGraph) => {
            return (singleSimpleConceptualGraph.label && singleSimpleConceptualGraph.label === label);
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
                const singleRelation: Relation = this.relationDao.getRelationByLabel(singleRelationLabel)
                conceptualGraph.addRelation(singleRelation)
            })
            return conceptualGraph;
        }
    }

    updateConceptualGraph(conceptualGraphToUpdate: ConceptualGraph): ConceptualGraph {
        this.simpleConceptualGraphs.forEach((singleSimpleConceptualGraph) => {
            if (conceptualGraphToUpdate.id === singleSimpleConceptualGraph.id) {
                singleSimpleConceptualGraph.label = conceptualGraphToUpdate.label;
                singleSimpleConceptualGraph.conceptLabels = conceptualGraphToUpdate.concepts.map((singleConcept) => {
                    this.conceptDao.updateConcept(singleConcept);
                    return singleConcept.label;
                });
                singleSimpleConceptualGraph.relationLabels = conceptualGraphToUpdate.relations.map((singleRelation) => {
                    this.relationDao.updateRelation(singleRelation);
                    return singleRelation.label;
                });
            }
        })
        return conceptualGraphToUpdate;
    }

}