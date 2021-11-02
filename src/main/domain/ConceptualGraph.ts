import { ConceptTypeDao } from "../conceptual-graphs";
import { MatchedConcept, MatchedRelation } from "../query/QueryManager";
import { isSetOneASubsetOfSetTwo } from "../util/CommonUtil";
import { cloneConcept, conceptToString, createConcept, isConcept } from "../util/ConceptUtil";
import { cloneRelation, createRelation, relationToString } from "../util/RelationUtil";
import { Concept, DesignatorType, Referent } from "./Concept";
import { Relation } from "./Relation";

export class SimpleConceptualGraph {
    id?: string;
    label: string;
    conceptLabels: string[] = [];
    relationLabels: string[] = [];
}

export class ConceptualGraph {

    concepts: Concept[] = [];
    relations: Relation[] = [];
    id: string;
    label: string;

    addConcept(concept: Concept) {
        this.concepts.push(cloneConcept(concept));
    }

    addConceptsIfNotExist(concepts: Concept[]) {
        concepts?.forEach((singleConceptToAdd) => {
            this.addConceptIfNotExist(singleConceptToAdd);
        })
    }

    addConceptIfNotExist(concept: Concept) {
        if (!this.getConceptByLabel(concept.label)) {
            this.addConcept(concept);
        }
    }

    addRelation(relation: Relation, conceptArgs?: Concept[]) {
        if (conceptArgs) {
            relation.conceptArgumentLabels = [];
            conceptArgs.forEach((singleConceptArg) => {
                if (!this.doesContainConcept(singleConceptArg)) {
                    this.concepts.push(singleConceptArg);
                }
                relation.conceptArgumentLabels.push(singleConceptArg.label);
            })
        }
        this.relations.push(cloneRelation(relation));
    }

    addRelationsIfNotExist(relations: Relation[]) {
        relations?.forEach((singleRelationToAdd) => {
            this.addRelationIfNotExist(singleRelationToAdd);
        })
    }

    addRelationIfNotExist(relation: Relation) {
        if (!this.getRelationByLabel(relation.label)) {
            this.addRelation(relation);
        }
    }

    addConceptOrRelation(conceptOrRelation: Concept | Relation) {
        if ((conceptOrRelation as any).conceptTypeLabels) {
            this.addConcept(conceptOrRelation as Concept);
        } else if ((conceptOrRelation as any).relationTypeLabels) {
            this.addRelation(conceptOrRelation as Relation);
        }
    }

    addConceptOrRelationIfNotExist(conceptOrRelation: Concept | Relation) {
        if (isConcept(conceptOrRelation)) {
            if (!this.getConceptByLabel(conceptOrRelation?.label)) {
                this.addConceptOrRelation(conceptOrRelation);
            }
        } else {
            if (!this.getRelationByLabel(conceptOrRelation?.label)) {
                this.addConceptOrRelation(conceptOrRelation);
            }
        }
    }

    createConcept(label: string, conceptTypeLabels: string | string[], referent?: string | Referent): Concept {
        const newConcept: Concept = createConcept(label, conceptTypeLabels, referent);
        this.concepts.push(newConcept);
        return newConcept;
    }

    createRelation(label: string, relationType: string, conceptArguments: Concept[]): Relation {
        const newRelation: Relation = createRelation(label, relationType, conceptArguments);
        this.relations.push(newRelation);
        return newRelation;
    }

    doesContainConcept(concept: Concept): boolean {
        return undefined !== this.concepts.find((singleExistingConcept) => {
            return (singleExistingConcept.label === concept.label);
        });
    }

    updateRelationByLabel(relationToUpdate: Relation) {
        this.relations.forEach((singleRelation) => {
            if (singleRelation.label === relationToUpdate.label) {
                singleRelation = cloneRelation(relationToUpdate);
            }
        })
    }

    removeConceptByLabel(conceptLabelToRemove: string) {
        this.concepts = this.concepts.filter((singleConcept) => {
            return (singleConcept.label !== conceptLabelToRemove);
        })
    }

    getConceptByLabel(conceptLabelToGet: string): Concept {
        return this.concepts.find((singleConcept) => {
            return (singleConcept?.label === conceptLabelToGet);
        })
    }

    getRelationByLabel(relationLabelToGet: string): Relation {
        return this.relations.find((singleRelation) => {
            return (singleRelation?.label === relationLabelToGet);
        })
    }

    getRelationsWhereConceptIsUsed(conceptToBeUsed: Concept, nodesToExclude?: (Relation | Concept)[]): Relation[] {
        if (conceptToBeUsed) {
            return this.relations.filter((singleRelation) => {
                return (singleRelation.conceptArgumentLabels.includes(conceptToBeUsed.label)
                    && !nodesToExclude?.includes(singleRelation));
            })
        } else {
            return [];
        }
    }

    getConceptsUsedByRelation(relation: Relation, conceptsToExclude: (Concept | Relation)[]): Concept[] {
        return this.concepts.filter((singleConcept) => {
            return (relation.conceptArgumentLabels.includes(singleConcept?.label)
                && !conceptsToExclude?.includes(singleConcept));
        })
    }

    clone(): ConceptualGraph {
        const clonedConceptualGraph: ConceptualGraph = new ConceptualGraph();
        clonedConceptualGraph.concepts = this.concepts.map((singleConcept) => {
            return cloneConcept(singleConcept);
        })
        clonedConceptualGraph.relations = this.relations.map((singleRelation) => {
            return cloneRelation(singleRelation);
        })
        return clonedConceptualGraph;
    }

    toString(): string {
        if (this.concepts && this.concepts.length > 0) {
            return this._generateStringForNode(this.concepts[0]);
        } else {
            return "Empty Conceptual Graph";
        }
    }

    private _generateStringForNode(curNode: Concept | Relation, prevNode?: Relation | Concept,
        alreadyProcessedNodes?: (Concept | Relation)[], curDepth?: number): string {
        let leftPadding: string = "";
        for (let i = 0; i < (curDepth ?? 1); i++) {
            leftPadding += "\t";
        }

        let curNodeString: string = "";
        if (isConcept(curNode)) {
            curNodeString = conceptToString(curNode as Concept);
        } else {
            curNodeString = relationToString(curNode as Relation);
        }

        let subNodesString: string = "";
        if (isConcept(curNode) && prevNode) {
            curNodeString = "-" + curNodeString;
        }
        if (!isConcept(curNode) && prevNode) {
            curNodeString = "-" + curNodeString;
        }
        if ((alreadyProcessedNodes ?? []).includes(curNode)) {
            return curNodeString;
        }
        if (alreadyProcessedNodes) {
            alreadyProcessedNodes.push(curNode);
        } else {

            alreadyProcessedNodes = [curNode];
        }

        const nextNodes: (Concept | Relation)[] = this._getNextNodes(curNode, [prevNode]);

        if (nextNodes?.length > 0) {
            curNodeString += "->";
        }

        nextNodes?.forEach((singleNextNode) => {
            subNodesString += '\n' + leftPadding + this._generateStringForNode(singleNextNode, curNode, alreadyProcessedNodes, curDepth ? curDepth + 1 : 2)
        })
        return curNodeString + subNodesString;
    }

    private _getNextNodes(curNode: Relation | Concept, nodesToExclude: (Relation | Concept)[]): (Relation | Concept)[] {
        const nextNodesFound: (Concept | Relation)[] = [];
        if ((curNode as any).conceptTypeLabels) {
            const nextRelations: Relation[] = this.getRelationsWhereConceptIsUsed(curNode as Concept, nodesToExclude);
            nextNodesFound.push(...nextRelations);
        } else {
            const nextConcepts: Concept[] = this.getConceptsUsedByRelation(curNode as Relation, nodesToExclude);
            nextNodesFound.push(...nextConcepts);
        }
        return nextNodesFound;
    }

    matchConceptsByExample(conceptToMatch: Concept, conceptTypeDao: ConceptTypeDao): Concept[] {
        // A concept matches when it has concept types equal to or lower than the concept to match's concept types
        const possibleConceptTypeLabels: string[] = conceptTypeDao.getLabelAndAllSubLabelsOfConceptType(conceptToMatch.conceptTypeLabels);
        const matchedConcepts: Concept[] = this.concepts.filter((singleConcept) => {
            let doesConceptMatch: boolean = false;
            let doConceptTypesMatch: boolean = isSetOneASubsetOfSetTwo(singleConcept.conceptTypeLabels, possibleConceptTypeLabels);
            if (conceptToMatch.referent?.designatorType === DesignatorType.LAMBDA && doConceptTypesMatch) {
                doesConceptMatch = true;
            } else if (doConceptTypesMatch
                && conceptToMatch.referent.designatorType === singleConcept.referent.designatorType
                && conceptToMatch.referent.designatorValue === singleConcept.referent.designatorValue) {
                doesConceptMatch = true;
            }
            return doesConceptMatch;
        })
        return matchedConcepts;
    }

    mergeFrom(otherConceptualGraph: ConceptualGraph) {
        otherConceptualGraph?.concepts?.forEach((singleConcept: Concept) => {
            this.addConceptIfNotExist(singleConcept);
        });
        otherConceptualGraph?.relations?.forEach((singleRelation: Relation) => {
            this.addRelationIfNotExist(singleRelation);
        });
    }

    isEmpty() {
        return (this.concepts.length === 0 && this.relations.length === 0);
    }
    
    replaceConceptByLabel(labelOfConceptToReplace: string, newConcept: Concept) {
        this.relations.forEach((singleRelation) => {
            singleRelation.conceptArgumentLabels = singleRelation.conceptArgumentLabels.map((singleRelationConceptArgumentLabel) => {
                if (singleRelationConceptArgumentLabel === labelOfConceptToReplace) {
                    return newConcept.label;
                } else {
                    return singleRelationConceptArgumentLabel;
                }
            })
        })
        this.concepts = this.concepts.map((singleConcept) => {
            if (singleConcept.label === labelOfConceptToReplace) {
                return newConcept;
            } else {
                return singleConcept;
            }
        })
    }
    
    replaceRelationByLabel(labelOfRelationToReplace: string, newRelation: MatchedRelation) {
        this.relations = this.relations.map((singleRelation) => {
            if (singleRelation.label === labelOfRelationToReplace) {
                return newRelation;
            } else {
                return singleRelation;
            }
        })
    }
}
