import { Concept } from "../../domain/Concept";
import { ConceptualGraph, SimpleConceptualGraph } from "../../domain/ConceptualGraph";
import { Relation } from "../../domain/Relation";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { FactDao } from "../FactDao";
import { RelationDao } from "../RelationDao";
import { Store } from "./store/Store";

export class InMemoryFactDao implements FactDao {
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    simpleConceptualGraphs: SimpleConceptualGraph[] = Store.getInstance().state.simpleConceptualGarphs;

    constructor(conceptDao: ConceptDao, relationDao: RelationDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
    }

    createFact(fact: ConceptualGraph): ConceptualGraph {
        const createdFact = new ConceptualGraph();
        const simpleConceptualGraph = new SimpleConceptualGraph();
        const generatedId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        fact.id = generatedId;
        createdFact.id = generatedId;
        simpleConceptualGraph.id = generatedId;
        createdFact.label = fact.label;
        simpleConceptualGraph.label = fact.label;
        fact.concepts.forEach((singleConcept: Concept) => {
            const possibleExistingConcept: Concept = this.conceptDao.getConceptByLabel(singleConcept.label);
            if (possibleExistingConcept) {
                const updatedConcept: Concept
                    = this.conceptDao.updateConcept(singleConcept);
                createdFact.concepts.push(updatedConcept);
                simpleConceptualGraph.conceptLabels.push(updatedConcept.label);
            } else {
                const createdConcept: Concept
                    = this.conceptDao.createConcept(singleConcept.label, singleConcept.conceptTypeLabels, singleConcept.referent);
                createdFact.concepts.push(createdConcept);
                simpleConceptualGraph.conceptLabels.push(createdConcept.label);
            }

        })
        fact.relations.forEach((singleRelation: Relation) => {
            const possibleExistingRelation: Relation = this.relationDao.getRelationByLabel(singleRelation.label);
            if (possibleExistingRelation) {
                const updatedRelation: Relation
                    = this.relationDao.updateRelation(singleRelation);
                createdFact.relations.push(updatedRelation);
                simpleConceptualGraph.relationLabels.push(updatedRelation.label);
            } else {
                const createdRelation: Relation
                    = this.relationDao.createRelation(singleRelation.label, singleRelation.relationTypeLabels, singleRelation.conceptArgumentLabels);
                createdFact.relations.push(createdRelation);
                simpleConceptualGraph.relationLabels.push(singleRelation.label);
            }
        })
        this.simpleConceptualGraphs.push(simpleConceptualGraph);
        return createdFact;
    }

    getFactById(conceptualGraphId: string): ConceptualGraph {
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

    getFactByLabel(label: string): ConceptualGraph {
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

    updateFact(conceptualGraphToUpdate: ConceptualGraph): ConceptualGraph {
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
    
    deleteFact(idToDelete: string): boolean {
        let isSuccessfulDelete: boolean = false;
        const lengthBeforeDelete: number = this.simpleConceptualGraphs.length;
        this.simpleConceptualGraphs = this.simpleConceptualGraphs.filter((singleSimpleConceptualGraph) => {
            return (singleSimpleConceptualGraph.id !== idToDelete);
        })
        if (this.simpleConceptualGraphs.length !== lengthBeforeDelete) {
            isSuccessfulDelete = true;
        }
        return isSuccessfulDelete;
    }

}