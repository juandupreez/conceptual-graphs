import { cloneConcept, cloneRelation, Concept, ConceptualGraph, ConceptualGraphQueryManager, DatabaseQueryManager, isConcept, Relation } from "../conceptual-graphs";
import { MatchedConceptualGraph } from "../query/QueryManager";
import { Operation } from "./Operation";

export class KBQuerySaturationOperation extends Operation {

    cgQueryManager: ConceptualGraphQueryManager;
    dbQueryManager: DatabaseQueryManager;

    constructor(conceptualGraphQueryManager: ConceptualGraphQueryManager, dbQueryManager: DatabaseQueryManager) {
        super();
        this.cgQueryManager = conceptualGraphQueryManager;
        this.dbQueryManager = dbQueryManager;
    }

    applyOperation(inputConceptualGraph: ConceptualGraph): ConceptualGraph {
        const appliedConceptualGraph: ConceptualGraph = inputConceptualGraph.clone();
        const matchedConceptualGraphs: MatchedConceptualGraph[] = this._getAllConceptualGraphsWhichMatchHypothesis(inputConceptualGraph);

        this._applyConclusionToMatchedGraphs(appliedConceptualGraph, matchedConceptualGraphs);
        return appliedConceptualGraph;
    }

    private _getAllConceptualGraphsWhichMatchHypothesis(conceptualGraphToMatch: ConceptualGraph): MatchedConceptualGraph[] {
        if (this.cgQueryManager && this.hypothesis?.concepts?.length > 0) {
            this.cgQueryManager.conceptualGraphToMatch = conceptualGraphToMatch;
            return this.cgQueryManager.executeQuery(this.hypothesis);
        } else {
            return [];
        }
    }

    private _applyConclusionToMatchedGraphs(appliedConceptualGraph: ConceptualGraph, matchedConceptualGraphs: MatchedConceptualGraph[]) {
        matchedConceptualGraphs.forEach((singleMatcheConceptualGraph) => {
            this._addKnowledgeBaseDataToAppliedCG(appliedConceptualGraph, singleMatcheConceptualGraph);
        })
    }
    private _addKnowledgeBaseDataToAppliedCG(appliedConceptualGraph: ConceptualGraph, matcheConceptualGraph: MatchedConceptualGraph) {
        const conclusionQuery: ConceptualGraph = this._createQueryFromConclusion(matcheConceptualGraph);
        const queryResults: ConceptualGraph[] = this.dbQueryManager.executeQuery(conclusionQuery);
        queryResults?.forEach((singleQueryResult) => {
            appliedConceptualGraph.mergeFrom(singleQueryResult);
        })
    }

    private _createQueryFromConclusion(matchedConceptualGraph: MatchedConceptualGraph): ConceptualGraph {
        const conclusionQuery: ConceptualGraph = this.conclusion.clone();
        matchedConceptualGraph.concepts.forEach((singleMatchedConcept) => {
            conclusionQuery.replaceConceptByLabel(singleMatchedConcept.templateConceptLabelWhichWasMatched, singleMatchedConcept);
        })
        matchedConceptualGraph.relations.forEach((singleMatchedRelation) => {
            conclusionQuery.replaceRelationByLabel(singleMatchedRelation.templateRelationLabelWhichWasMatched, singleMatchedRelation);
        })

        return conclusionQuery;
    }

    // private _recursivelyApplyConclusionNode(appliedConceptualGraph: ConceptualGraph, matchedConceptualGraph: MatchedConceptualGraph,
    //     curConclusionNode: Concept | Relation, prevConclusionNode?: Relation | Concept, alreadyProcessedNodesInThisPath?: (Concept | Relation)[]) {
    //     if (!appliedConceptualGraph || !matchedConceptualGraph || !curConclusionNode) {
    //         return;
    //     }
    //     this._addNewNodeToAppliedCGIfNotExists(appliedConceptualGraph, matchedConceptualGraph, curConclusionNode);
    //     if (!this._isLeaf(curConclusionNode, [...(alreadyProcessedNodesInThisPath ?? []), prevConclusionNode])) {
    //         const nextConclusionNodes: (Concept | Relation)[] = this._getNextNodes(curConclusionNode, prevConclusionNode);
    //         nextConclusionNodes?.forEach((singleNextConclusionNode) => {
    //             this._recursivelyApplyConclusionNode(appliedConceptualGraph, matchedConceptualGraph, singleNextConclusionNode, curConclusionNode,
    //                 alreadyProcessedNodesInThisPath ? [...alreadyProcessedNodesInThisPath, curConclusionNode] : [curConclusionNode]);
    //         })
    //     }

    // }

    // private _addNewNodeToAppliedCGIfNotExists(appliedConceptualGraph: ConceptualGraph, matchedConceptualGraph: MatchedConceptualGraph,
    //     curConclusionNode: Concept | Relation) {
    //     if (isConcept(curConclusionNode)) {
    //         this._addNewConceptToAppliedCGIfNotExists(appliedConceptualGraph, matchedConceptualGraph, curConclusionNode as Concept);
    //     } else {
    //         this._addNewRelationToAppliedCGIfNotExists(appliedConceptualGraph, matchedConceptualGraph, curConclusionNode as Relation);
    //     }
    // }
    // private _addNewConceptToAppliedCGIfNotExists(appliedConceptualGraph: ConceptualGraph, matchedConceptualGraph: MatchedConceptualGraph,
    //     curConclusionConcept: Concept) {
    //     const matchedConcept: Concept = matchedConceptualGraph.getConceptByTemplateMatchedLabel(curConclusionConcept.label);
    //     if (!matchedConcept) {
    //         const newConcept: Concept = cloneConcept(curConclusionConcept);
    //         appliedConceptualGraph.addConceptIfNotExist(newConcept);
    //     }
    // }

    // private _addNewRelationToAppliedCGIfNotExists(appliedConceptualGraph: ConceptualGraph, matchedConceptualGraph: MatchedConceptualGraph,
    //     curConclusionRelation: Relation) {
    //     const matchedRelation: Relation = matchedConceptualGraph.getRelationByTemplateMatchedLabel(curConclusionRelation.label);
    //     if (!matchedRelation) {
    //         const newRelation: Relation = {
    //             ...cloneRelation(curConclusionRelation),
    //             label: this._getNewRelationLabel(curConclusionRelation, matchedConceptualGraph),
    //             conceptArgumentLabels: this._getNewRelationConceptArgumentLabels(curConclusionRelation, matchedConceptualGraph)
    //         };
    //         appliedConceptualGraph.addRelationIfNotExist(newRelation);
    //     }
    // }

    // private _getNewRelationLabel(conclusionRelation: Relation, matchedConceptualGraph: MatchedConceptualGraph): string {
    //     let newRelationLabel: string = "";
    //     const firstConceptArgumentLabel: string =
    //         matchedConceptualGraph?.getConceptByTemplateMatchedLabel(conclusionRelation?.conceptArgumentLabels[0])?.label ??
    //         conclusionRelation?.conceptArgumentLabels[0];
    //     newRelationLabel = firstConceptArgumentLabel + "-";
    //     newRelationLabel += conclusionRelation?.relationTypeLabels?.join('_');
    //     for (let i = 1; i < conclusionRelation?.conceptArgumentLabels?.length; i++) {
    //         const singleArgumentLabel = conclusionRelation.conceptArgumentLabels[i];
    //         newRelationLabel += "-" + (matchedConceptualGraph?.getConceptByTemplateMatchedLabel(singleArgumentLabel)?.label ??
    //             singleArgumentLabel);

    //     }
    //     return newRelationLabel;
    // }

    // private _getNewRelationConceptArgumentLabels(conclusionRelation: Relation, matchedConceptualGraph: MatchedConceptualGraph): string[] {
    //     const newArgumentLabels: string[] = [];
    //     conclusionRelation?.conceptArgumentLabels?.forEach((singleConclusionLabel) => {
    //         const conceptInMatchedCG: Concept = matchedConceptualGraph?.getConceptByTemplateMatchedLabel(singleConclusionLabel);
    //         if (conceptInMatchedCG) {
    //             newArgumentLabels.push(conceptInMatchedCG.label);
    //         } else {
    //             newArgumentLabels.push(singleConclusionLabel);
    //         }
    //     })
    //     return newArgumentLabels;
    // }

    // private _isLeaf(conclusionNode: Concept | Relation, nodesToExclude: (Relation | Concept)[]) {
    //     let isLeaf: boolean = true;
    //     if (isConcept(conclusionNode)) {
    //         const relationsWhereConceptIsUsed: Relation[] =
    //             this.conclusion.getRelationsWhereConceptIsUsed(conclusionNode as Concept, nodesToExclude);
    //         if (relationsWhereConceptIsUsed.length > 0) {
    //             isLeaf = false;
    //         }
    //     } else {
    //         const conceptsUsedByRelation: Concept[] = this.conclusion.getConceptsUsedByRelation(conclusionNode as Relation, nodesToExclude);
    //         if (conceptsUsedByRelation.length > 0) {
    //             isLeaf = false;
    //         }

    //     }
    //     return isLeaf;
    // }

    // private _getNextNodes(conclusionNode: Concept | Relation, nodeToExclude: Relation | Concept): (Concept | Relation)[] {
    //     const nextNodesFound: (Concept | Relation)[] = [];
    //     if (isConcept(conclusionNode)) {
    //         const nextRelations: Relation[] = this.conclusion.getRelationsWhereConceptIsUsed(conclusionNode as Concept, [nodeToExclude as Relation]);
    //         nextNodesFound.push(...nextRelations);
    //     } else {
    //         const nextConcepts: Concept[] = this.conclusion.getConceptsUsedByRelation(conclusionNode as Relation, [nodeToExclude as Concept]);
    //         nextNodesFound.push(...nextConcepts);
    //     }
    //     return nextNodesFound;
    // }

    toString(): string {
        return "Hypothesis:\n----------\n"
            + this.hypothesis.toString()
            + "\n\nConclusion:\n----------\n"
            + this.conclusion.toString()
    }

}