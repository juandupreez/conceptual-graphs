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

    _recursiveMatchNode(query: ConceptualGraph, queryNode: Concept | Relation,
        previousMatchedNode?: Concept | Relation, alreadyProcessedNodes?: (Concept | Relation)[]): ConceptualGraph[] {
        if  (!alreadyProcessedNodes) {
            alreadyProcessedNodes = [queryNode];
        } else {
            alreadyProcessedNodes.push(queryNode);
        }
        const returnAnswerConceptualGraphs: ConceptualGraph[] = [];
        const matchedNodes: Concept[] | Relation[] = this._matchNodesInDB(queryNode, previousMatchedNode);
        if (this._isLeaf(query, queryNode, alreadyProcessedNodes) && matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                const newPotentailAnswerCG: ConceptualGraph = new ConceptualGraph();
                newPotentailAnswerCG.addConceptOrRelation(singleMatchedNode);
                returnAnswerConceptualGraphs.push(newPotentailAnswerCG);
            })
        } else if (matchedNodes?.length > 0) {
            matchedNodes.forEach((singleMatchedNode: Concept | Relation) => {
                let doesMatchAllChildren: boolean = true;
                let nextQueryNodes: Concept[] | Relation[] = this._getNextQueryNodes(query, queryNode, alreadyProcessedNodes);
                const potentialAnswerCGs = [];
                for (let i = 0; nextQueryNodes && i < nextQueryNodes.length; i++) {
                    const singleNextQueryNode: Concept | Relation = nextQueryNodes[i];
                    const subPotientialAnswerCGs: ConceptualGraph[] = this._recursiveMatchNode(query, singleNextQueryNode, singleMatchedNode, alreadyProcessedNodes);
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
                    potentialAnswerCGs.push(...subPotientialAnswerCGs);
                }
                if (doesMatchAllChildren) {
                    potentialAnswerCGs.forEach((singlePotentialAnswer: ConceptualGraph) => {
                        singlePotentialAnswer.addConceptOrRelation(singleMatchedNode);
                        returnAnswerConceptualGraphs.push(singlePotentialAnswer);
                    });
                }
            })
        }
        return returnAnswerConceptualGraphs;
    }
    private _matchNodesInDB(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation): Concept[] | Relation[] {
        if ((queryNode as any).conceptTypeLabels) {
            const matchedConcepts = this.conceptDao.getConceptsByExample(queryNode as Concept);
            return matchedConcepts;
        } else {
            const matchedRelations = this.relationDao.getRelationsByExample(queryNode as Relation);
            return matchedRelations;

        }
    }
    private _isLeaf(query: ConceptualGraph, queryNode: Concept | Relation, alreadyProcessedNodes: (Concept | Relation)[]): boolean {
        let isLeaf: boolean = true;
        if ((queryNode as any).conceptTypeLabels) {
            const relationsWhereConceptIsUsed: Relation[] = query.getRelationsWhereConceptIsUsed(queryNode as Concept, alreadyProcessedNodes);
            if (relationsWhereConceptIsUsed.length > 0) {
                isLeaf = false;
            }
        } else {
            const conceptsUsedByRelation: Concept[] = query.getConceptsUsedByRelation(queryNode as Relation, alreadyProcessedNodes);
            if (conceptsUsedByRelation.length > 0) {
                isLeaf = false;
            }

        }
        return isLeaf;
    }
    private _getNextQueryNodes(query: ConceptualGraph, queryNode: Concept | Relation, alreadyProcessedNodes: (Concept | Relation)[]): Concept[] | Relation[] {
        if ((queryNode as any).conceptTypeLabels) {
            return query.getRelationsWhereConceptIsUsed(queryNode as Concept, alreadyProcessedNodes);
        } else {
            return query.getConceptsUsedByRelation(queryNode as Relation, alreadyProcessedNodes);
        }
    }
}