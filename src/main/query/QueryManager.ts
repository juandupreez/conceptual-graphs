import { ConceptDao } from "../dao/ConceptDao";
import { ConceptTypeDao } from "../dao/ConceptTypeDao";
import { RelationDao } from "../dao/RelationDao";
import { RelationTypeDao } from "../dao/RelationTypeDao";
import { Concept } from "../domain/Concept";
import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";

export class QueryManager {
    conceptDao: ConceptDao;
    relationDao: RelationDao;

    constructor(conceptDao: ConceptDao, conceptTypeDao: ConceptTypeDao, relationDao: RelationDao, relationTypeDao: RelationTypeDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
    }

    executeQuery(queryCoceptualGraph: ConceptualGraph): ConceptualGraph[] {
        if (queryCoceptualGraph.concepts.length > 0) {
            return this._recursiveMatchNode(queryCoceptualGraph, queryCoceptualGraph.concepts[0])
        } else {
            return [];
        }
    }

    private _recursiveMatchNode(query: ConceptualGraph, queryNode: Concept | Relation, previousQueryNode?: Concept | Relation,
        previousMatchedNode?: Concept | Relation, alreadyProcessedNodes?: (Concept | Relation)[]): ConceptualGraph[] {
        const returnAnswerConceptualGraphs: ConceptualGraph[] = [];
        if (!alreadyProcessedNodes) {
            alreadyProcessedNodes = [];
        }
        const matchedNodes: (Concept | Relation)[] = this._matchNodesInDB(queryNode, previousMatchedNode, query);
        if (this._isLeaf(query, queryNode, previousQueryNode, alreadyProcessedNodes) && matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                const newPotentailAnswerCG: ConceptualGraph = new ConceptualGraph();
                newPotentailAnswerCG.addConceptOrRelationIfNotExist(singleMatchedNode);
                returnAnswerConceptualGraphs.push(newPotentailAnswerCG);
            })
        } else if (matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                let doesMatchAllChildren: boolean = true;
                let nextQueryNodes: (Concept | Relation)[] = this._getNextQueryNodes(query, queryNode, previousQueryNode);
                if (nextQueryNodes && nextQueryNodes.length > 0) {
                    const potentialAnswerCGs: ConceptualGraph[]
                        = this._recursiveMatchNode(query, nextQueryNodes[0], queryNode, singleMatchedNode, [...alreadyProcessedNodes, queryNode]);
                    for (let i = 1; nextQueryNodes && i < nextQueryNodes.length; i++) {
                        const singleNextQueryNode: Concept | Relation = nextQueryNodes[i];
                        const subPotientialAnswerCGs: ConceptualGraph[]
                            = this._recursiveMatchNode(query, singleNextQueryNode, queryNode, singleMatchedNode, alreadyProcessedNodes);
                        potentialAnswerCGs.forEach((singlePotentialAnswer) => {
                            subPotientialAnswerCGs.forEach((singleSubPotentialAnswer) => {
                                singlePotentialAnswer.addConceptsIfNotExist(singleSubPotentialAnswer.concepts);
                                singlePotentialAnswer.addRelationsIfNotExist(singleSubPotentialAnswer.relations);
                            })
                        })
                        if (subPotientialAnswerCGs.length === 0) {
                            doesMatchAllChildren = false;
                            break;
                        }
                        // potentialAnswerCGs.push(...subPotientialAnswerCGs);
                        potentialAnswerCGs.forEach((singlePotentialAnswerCG) => {
                            subPotientialAnswerCGs.forEach((singleSubPotentialAnswerCG) => {
                                singlePotentialAnswerCG.addConceptsIfNotExist(singleSubPotentialAnswerCG.concepts);
                                singlePotentialAnswerCG.addRelationsIfNotExist(singleSubPotentialAnswerCG.relations);
                            })
                        })
                    }
                    if (doesMatchAllChildren) {
                        potentialAnswerCGs.forEach((singlePotentialAnswer: ConceptualGraph) => {
                            singlePotentialAnswer.addConceptOrRelationIfNotExist(singleMatchedNode);
                            returnAnswerConceptualGraphs.push(singlePotentialAnswer);
                        });
                    }
                }
            })
        }
        return returnAnswerConceptualGraphs;
    }

    private _matchNodesInDB(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation, query: ConceptualGraph): (Concept | Relation)[] {
        if ((queryNode as any).conceptTypeLabels) {
            const matchedConcepts: Concept[] = this.conceptDao.getConceptsByExample(queryNode as Concept);
            if (previousMatchedNode) {
                return matchedConcepts.filter((singleMatchedConcept) => {
                    return ((previousMatchedNode as Relation).conceptArgumentLabels.includes(singleMatchedConcept.label));
                }) ?? [];
            } else {
                return matchedConcepts;
            }
        } else {
            const matchedRelations: Relation[] = this.relationDao.getRelationsByExample(queryNode as Relation, query);
            return matchedRelations.filter((singleMatchedRelation) => {
                return (singleMatchedRelation.conceptArgumentLabels.includes(previousMatchedNode.label));
            }) ?? [];
        }
    }

    private _isLeaf(query: ConceptualGraph, queryNode: Concept | Relation, nodeToExclude: Concept | Relation, alreadyProcessedNodes?: (Concept | Relation)[]): boolean {
        let isLeaf: boolean = true;
        const hasAlreadyBeenProcessed: boolean = alreadyProcessedNodes?.includes(queryNode);
        if ((queryNode as any).conceptTypeLabels) {
            const relationsWhereConceptIsUsed: Relation[] = query.getRelationsWhereConceptIsUsed(queryNode as Concept, nodeToExclude as Relation);
            if (relationsWhereConceptIsUsed.length > 0) {
                isLeaf = false;
            }
        } else {
            const conceptsUsedByRelation: Concept[] = query.getConceptsUsedByRelation(queryNode as Relation, nodeToExclude as Concept);
            if (conceptsUsedByRelation.length > 0) {
                isLeaf = false;
            }

        }
        return isLeaf || hasAlreadyBeenProcessed;
    }

    private _getNextQueryNodes(query: ConceptualGraph, queryNode: Concept | Relation,
        nodeToExclude: Concept | Relation): (Concept | Relation)[] {
        const nextNodesFound: (Concept | Relation)[] = [];
        if ((queryNode as any).conceptTypeLabels) {
            const nextRelations: Relation[] = query.getRelationsWhereConceptIsUsed(queryNode as Concept, nodeToExclude as Relation);
            nextNodesFound.push(...nextRelations);
        } else {
            const nextConcepts: Concept[] = query.getConceptsUsedByRelation(queryNode as Relation, nodeToExclude as Concept);
            nextNodesFound.push(...nextConcepts);
        }
        return nextNodesFound;
    }
}