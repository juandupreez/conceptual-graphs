import { Concept } from "../domain/Concept";
import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";
import { isConcept } from "../util/ConceptUtil";

export class QueryManager {    

    executeQuery(queryCoceptualGraph: ConceptualGraph): MatchedConceptualGraph[] {
        if (queryCoceptualGraph.concepts.length > 0) {
            return this._recursiveMatchNode(queryCoceptualGraph, queryCoceptualGraph.concepts[0])
        } else {
            return [];
        }
    }

    private _recursiveMatchNode(query: ConceptualGraph, queryNode: Concept | Relation, previousQueryNode?: Concept | Relation,
        previousMatchedNode?: Concept | Relation, alreadyProcessedNodes?: (Concept | Relation)[], depth?: number): MatchedConceptualGraph[] {
        let spacer: string = "";
        for (let i = 0; i < depth; i++) {
            spacer += "\t";
        }
        // console.log(spacer + "Cur Node: " + queryNode.label);
        // console.log(spacer + "Prev Node: " + previousMatchedNode?.label);

        const returnAnswerConceptualGraphs: MatchedConceptualGraph[] = [];
        if (!alreadyProcessedNodes) {
            alreadyProcessedNodes = [];
        }
        const positionInRelationArguments: number = this._getPositionInRelationArguments(previousQueryNode, queryNode);
        const matchedNodes: (Concept | Relation)[] = this._matchNodes(queryNode, previousMatchedNode, query, positionInRelationArguments);
        // console.log(spacer + "Matched Nodes in DB: " + matchedNodes?.map((singleMatched) => { return singleMatched.label }).join(', '));

        if (this._isLeaf(query, queryNode, previousQueryNode, alreadyProcessedNodes) && matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                const newPotentailAnswerCG: MatchedConceptualGraph = new MatchedConceptualGraph();
                newPotentailAnswerCG.addConceptOrRelationIfNotExist(singleMatchedNode);
                returnAnswerConceptualGraphs.push(newPotentailAnswerCG);
            })
        } else if (matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation, matchedNodeIndex) => {
                // console.log(spacer + "Current Matched Node: " + singleMatchedNode?.label);
                let doesMatchAllChildren: boolean = true;
                let nextQueryNodes: (Concept | Relation)[] = this._getNextQueryNodes(query, queryNode, previousQueryNode);
                // console.log(spacer + "Next Query Nodes: " + nextQueryNodes?.map((singleNode) => { return singleNode.label }).join(', '));
                if (nextQueryNodes && nextQueryNodes.length > 0) {
                    const potentialAnswerCGs: MatchedConceptualGraph[]
                        = this._recursiveMatchNode(query, nextQueryNodes[0], queryNode, singleMatchedNode,
                            [...alreadyProcessedNodes, queryNode], depth ? depth + 1 : 1);
                    for (let i = 1; nextQueryNodes && i < nextQueryNodes.length; i++) {
                        const singleNextQueryNode: Concept | Relation = nextQueryNodes[i];
                        const subPotientialAnswerCGs: MatchedConceptualGraph[]
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
                        potentialAnswerCGs.forEach((singlePotentialAnswer: MatchedConceptualGraph) => {
                            singlePotentialAnswer.addConceptOrRelationIfNotExist(singleMatchedNode);
                            returnAnswerConceptualGraphs.push(singlePotentialAnswer);
                        });
                    }
                }
            })
        }
        // console.log(spacer + "Returning conceptual graphs of answers with size: " + returnAnswerConceptualGraphs.length);

        return returnAnswerConceptualGraphs;
    }
    
    private _getPositionInRelationArguments(conceptOrRelation: Concept | Relation, relationOrConcept: Concept | Relation): number {
        if (isConcept(conceptOrRelation)) {
            return (relationOrConcept as Relation)?.conceptArgumentLabels?.indexOf((conceptOrRelation as Concept).label);
        } else {
            return (conceptOrRelation as Relation)?.conceptArgumentLabels?.indexOf((relationOrConcept as Concept).label);
        }
    }

    protected _matchNodes(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation, query: ConceptualGraph,
        positionInRelationArguments: number): (Concept | Relation)[] {
            // To be implemented in sub-classes
        return [];
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

export interface MatchedConcept extends Concept {
    templateConceptLabelWhichWasMatched: string;
}

export interface MatchedRelation extends Relation {
    templateRelationLabelWhichWasMatched: string;
}

export class MatchedConceptualGraph extends ConceptualGraph {
    concepts: MatchedConcept[];
    relations: MatchedRelation[];
    
    getRelationByTemplateMatchedLabel(templateLabel: string): Relation {
        return this.relations.find((singleRelation) => {
            return singleRelation.templateRelationLabelWhichWasMatched === templateLabel;
        })
    }
    
    getConceptByTemplateMatchedLabel(templateLabel: string): Concept {
        return this.concepts.find((singleConcept) => {
            return singleConcept.templateConceptLabelWhichWasMatched === templateLabel;
        })
    }
}