import { ConceptDao } from "../dao/ConceptDao";
import { ConceptTypeDao } from "../dao/ConceptTypeDao";
import { RelationDao } from "../dao/RelationDao";
import { RelationTypeDao } from "../dao/RelationTypeDao";
import { Concept } from "../domain/Concept";
import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";
import { isConcept } from "../util/ConceptUtil";

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
        previousMatchedNode?: Concept | Relation, alreadyProcessedNodes?: (Concept | Relation)[], depth?: number): ConceptualGraph[] {
        let spacer: string = "";
        for (let i = 0; i < depth; i++) {
            spacer += "\t";
        }
        console.log(spacer + "Cur Node: " + queryNode.label);
        console.log(spacer + "Prev Node: " + previousMatchedNode?.label);

        const returnAnswerConceptualGraphs: ConceptualGraph[] = [];
        if (!alreadyProcessedNodes) {
            alreadyProcessedNodes = [];
        }
        const positionInRelationArguments: number = this._getPositionInRelationArguments(previousQueryNode, queryNode);
        const matchedNodes: (Concept | Relation)[] = this._matchNodesInDB(queryNode, previousMatchedNode, query, positionInRelationArguments);
        console.log(spacer + "Matched Nodes in DB: " + matchedNodes?.map((singleMatched) => { return singleMatched.label }).join(', '));

        if (this._isLeaf(query, queryNode, previousQueryNode, alreadyProcessedNodes) && matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                const newPotentailAnswerCG: ConceptualGraph = new ConceptualGraph();
                newPotentailAnswerCG.addConceptOrRelationIfNotExist(singleMatchedNode);
                returnAnswerConceptualGraphs.push(newPotentailAnswerCG);
            })
        } else if (matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation, matchedNodeIndex) => {
                console.log(spacer + "Current Matched Node: " + singleMatchedNode?.label);
                let doesMatchAllChildren: boolean = true;
                let nextQueryNodes: (Concept | Relation)[] = this._getNextQueryNodes(query, queryNode, previousQueryNode);
                console.log(spacer + "Next Query Nodes: " + nextQueryNodes?.map((singleNode) => { return singleNode.label }).join(', '));
                if (nextQueryNodes && nextQueryNodes.length > 0) {
                    const potentialAnswerCGs: ConceptualGraph[]
                        = this._recursiveMatchNode(query, nextQueryNodes[0], queryNode, singleMatchedNode,
                            [...alreadyProcessedNodes, queryNode], depth ? depth + 1 : 1);
                    for (let i = 1; nextQueryNodes && i < nextQueryNodes.length; i++) {
                        const singleNextQueryNode: Concept | Relation = nextQueryNodes[i];
                        const subPotientialAnswerCGs: ConceptualGraph[]
                            = this._recursiveMatchNode(query, singleNextQueryNode, queryNode, singleMatchedNode,
                                alreadyProcessedNodes, depth ? depth + 1 : 1);
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
        console.log(spacer + "Returning conceptual graphs of answers with size: " + returnAnswerConceptualGraphs.length);

        return returnAnswerConceptualGraphs;
    }
    private _getPositionInRelationArguments(concept: Concept | Relation, relation: Concept | Relation): number {
        if (isConcept(concept)) {
            return (relation as Relation)?.conceptArgumentLabels?.indexOf((concept as Concept).label);
        } else {
            return -1;
        }
    }

    private _matchNodesInDB(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation, query: ConceptualGraph,
        positionInRelationArguments: number): (Concept | Relation)[] {
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
                const doesPreviousConceptMatch: boolean = positionInRelationArguments !== -1 ?
                    singleMatchedRelation.conceptArgumentLabels[positionInRelationArguments] === previousMatchedNode.label :
                    singleMatchedRelation.conceptArgumentLabels.includes(previousMatchedNode.label);
                // const doesPreviousConceptMatch: boolean = 
                //     singleMatchedRelation.conceptArgumentLabels.includes(previousMatchedNode.label);
                return doesPreviousConceptMatch;
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