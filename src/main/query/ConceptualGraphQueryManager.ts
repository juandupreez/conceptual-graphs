import { ConceptTypeDao } from "../dao/ConceptTypeDao";
import { RelationTypeDao } from "../dao/RelationTypeDao";
import { Concept, DesignatorType } from "../domain/Concept";
import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";
import { MatchedConcept, MatchedRelation, QueryManager } from "./QueryManager";

export class ConceptualGraphQueryManager extends QueryManager {
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    conceptualGraphToMatch: ConceptualGraph = new ConceptualGraph();

    constructor(conceptTypeDao: ConceptTypeDao, relationTypeDao: RelationTypeDao) {
        super();
        this.conceptTypeDao = conceptTypeDao;
        this.relationTypeDao = relationTypeDao;
    }

    protected _matchNodes(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation, query: ConceptualGraph,
        positionInRelationArguments: number): (Concept | Relation)[] {
        if (this.conceptualGraphToMatch) {
            if ((queryNode as any).conceptTypeLabels) {
                const matchedConcepts: Concept[] = this._getConceptsFromConceptualGraphByExample(queryNode as Concept);
                if (previousMatchedNode) {
                    return matchedConcepts.filter((singleMatchedConcept) => {
                        const doesPreviousRelationMatch: boolean = positionInRelationArguments !== -1 ?
                            (previousMatchedNode as Relation).conceptArgumentLabels[positionInRelationArguments] === singleMatchedConcept.label :
                            ((previousMatchedNode as Relation).conceptArgumentLabels.includes(singleMatchedConcept.label));
                        return doesPreviousRelationMatch;
                    }) ?? [];
                } else {
                    return matchedConcepts;
                }
            } else {
                const matchedRelations: Relation[] = this._getRelationsFromConceptualGraphByExample(queryNode as Relation, query);
                return matchedRelations.filter((singleMatchedRelation) => {
                    const doesPreviousConceptMatch: boolean = positionInRelationArguments !== -1 ?
                        singleMatchedRelation.conceptArgumentLabels[positionInRelationArguments] === previousMatchedNode.label :
                        singleMatchedRelation.conceptArgumentLabels.includes(previousMatchedNode.label);
                    return doesPreviousConceptMatch;
                }) ?? [];
            }
        }
    }

    private _getConceptsFromConceptualGraphByExample(conceptToMatch: Concept): Concept[] {        
        // A concept matches when it has concept types equal to or lower than the concept to match's concept types
        const possibleConceptTypeLabels: string[] = this._getAllSubConceptTypes(conceptToMatch.conceptTypeLabels);
        const matchedConcepts: Concept[] = this.conceptualGraphToMatch.concepts.filter((singleConcept) => {
            let doesConceptMatch: boolean = false;
            let doConceptTypesMatch: boolean = this._isSetOneASubsetOfSetTwo(singleConcept.conceptTypeLabels, possibleConceptTypeLabels);
            if (conceptToMatch.referent?.designatorType === DesignatorType.LAMBDA && doConceptTypesMatch) {
                doesConceptMatch = true;
            } else if (doConceptTypesMatch
                && conceptToMatch.referent.designatorType === singleConcept.referent.designatorType
                && conceptToMatch.referent.designatorValue === singleConcept.referent.designatorValue) {
                doesConceptMatch = true;
            }
            return doesConceptMatch;
        })
        return matchedConcepts?.map((singleMatchedConcept: MatchedConcept) => {
            return {
                ...singleMatchedConcept,
                templateConceptLabelWhichWasMatched: conceptToMatch.label
            }
        })
    }

    private _getAllSubConceptTypes(conceptTypeLabels: string[]): string[] {
        return conceptTypeLabels.reduce((accumulator: string[], singleConceptTypeLabel) => {
            accumulator.push(...this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(singleConceptTypeLabel));
            return accumulator;
        }, []);
    }

    private _isSetOneASubsetOfSetTwo(setA: string[], setB: string[]): boolean {
        let isASubset: boolean = true;
        for (let i = 0; i < setA.length; i++) {
            const singeElement = setA[i];
            if (!setB.includes(singeElement)) {
                isASubset = false;
                break;
            }
        }
        return isASubset;
    }
    
    private _getRelationsFromConceptualGraphByExample(relationToMatch: Relation, query: ConceptualGraph): Relation[] {
        // A relation matches when it has relation types equal to or lower than the relation to match's relation types
        const possibleRelationTypeLabels: string[] = this._getAllSubRelationTypes(relationToMatch.relationTypeLabels);
        const matchedRelations: Relation[] = this.conceptualGraphToMatch.relations.filter((singleRelation) => {
            let doesRelationMatch: boolean = false;
            let doConceptsMatch: boolean = query ? this._doConceptsMatch(relationToMatch.conceptArgumentLabels, singleRelation.conceptArgumentLabels, query) : true;
            let doAllRelationTypesMatchSignature: boolean = this._isSetOneASubsetOfSetTwo(singleRelation.relationTypeLabels, possibleRelationTypeLabels);
            if (doAllRelationTypesMatchSignature && doConceptsMatch) {
                doesRelationMatch = true;
            }
            return doesRelationMatch;
        })
        return matchedRelations?.map((singleMatchedRelation: MatchedRelation) => {
            return {
                ...singleMatchedRelation,
                templateRelationLabelWhichWasMatched: relationToMatch.label
            }
        })
    }

    private _getAllSubRelationTypes(relationTypeLabels: string[]): string[] {
        return relationTypeLabels.reduce((accumulator: string[], singleRelationTypeLabel) => {
            accumulator.push(...this.relationTypeDao.getLabelAndAllSubLabelsOfRelation(singleRelationTypeLabel));
            return accumulator;
        }, []);
    }

    private _doConceptsMatch(conceptArgumentLabelsToMatch: string[], conceptArgumentLabels: string[], query: ConceptualGraph): boolean {
        if (!query) {
            return true;
        } else if (conceptArgumentLabelsToMatch?.length !== conceptArgumentLabels?.length) {
            return false;
        } else {
            let doAllConceptsMatch: boolean = true;
            conceptArgumentLabelsToMatch?.forEach((singleConceptLabelToMatch, index) => {
                const conceptToMatch: Concept = query.getConceptByLabel(singleConceptLabelToMatch);
                const potentialConcept: Concept = this.conceptualGraphToMatch.getConceptByLabel(conceptArgumentLabels[index]);
                const possibleConceptTypeLabels: string[] = this.conceptTypeDao.getLabelAndAllSubLabelsOfConcept(conceptToMatch.conceptTypeLabels);
                const potentialConceptTypeLabels: string[] = potentialConcept?.conceptTypeLabels ?? [];
                const doConceptTypesMatch: boolean = doAllConceptsMatch && this._isSetOneASubsetOfSetTwo(potentialConceptTypeLabels, possibleConceptTypeLabels);

                if (conceptToMatch.referent?.designatorType === DesignatorType.LAMBDA && doConceptTypesMatch) {
                    doAllConceptsMatch = doAllConceptsMatch && true;
                } else if (doConceptTypesMatch
                    && conceptToMatch.referent.designatorType === potentialConcept.referent.designatorType
                    && conceptToMatch.referent.designatorValue === potentialConcept.referent.designatorValue) {
                    doAllConceptsMatch = doAllConceptsMatch && true;
                } else {
                    doAllConceptsMatch = false
                }

            })
            return doAllConceptsMatch;
        }
    }
}