import { cloneConcept, conceptToString, isConcept } from "../util/ConceptUtil";
import { cloneRelation, relationToString } from "../util/RelationUtil";
import { Concept, DesignatorType, QuantifierType, Referent } from "./Concept";
import { Relation } from "./Relation";

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
            if (!this.getConceptByLabel(singleConceptToAdd.label)) {
                this.addConcept(singleConceptToAdd);
            }
        })
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
            if (!this.getRelationByLabel(singleRelationToAdd.label)) {
                this.addRelation(singleRelationToAdd);
            }
        })
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
        const newConcept: Concept = new Concept();
        newConcept.label = label;
        if (typeof conceptTypeLabels === "string") {
            newConcept.conceptTypeLabels.push(conceptTypeLabels);
        } else if (conceptTypeLabels && conceptTypeLabels.length > 0) {
            conceptTypeLabels.forEach((singleConceptTypeLabel) => {
                newConcept.conceptTypeLabels.push(singleConceptTypeLabel);
            });
        }
        if (!referent) {
            newConcept.referent = {
                quantifierType: QuantifierType.A_SINGLE,
                quantifierValue: undefined,
                designatorType: DesignatorType.BLANK,
                designatorValue: undefined
            };
        } else if (typeof referent === "string") {
            if (referent === DesignatorType.LAMBDA) {
                newConcept.referent = {
                    quantifierType: QuantifierType.A_SINGLE,
                    quantifierValue: undefined,
                    designatorType: DesignatorType.LAMBDA,
                    designatorValue: undefined
                };
            } else {
                newConcept.referent = {
                    quantifierType: QuantifierType.A_SINGLE,
                    quantifierValue: undefined,
                    designatorType: DesignatorType.LITERAL,
                    designatorValue: referent
                };
            }
        } else {
            newConcept.referent = {
                quantifierType: referent.quantifierType,
                quantifierValue: referent.quantifierValue,
                designatorType: referent.designatorType,
                designatorValue: referent.designatorValue
            };
        }
        this.concepts.push(newConcept);
        return newConcept;
    }

    createRelation(label: string, relationType: string, conceptArguments: Concept[]): Relation {
        const newRelation: Relation = new Relation();
        newRelation.label = label;
        newRelation.relationTypeLabels.push(relationType);
        newRelation.conceptArgumentLabels.push(...conceptArguments.map((singleConceptArgument: Concept) => {
            return singleConceptArgument.label;
        }));
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
            return (singleConcept.label === conceptLabelToGet);
        })
    }

    getRelationByLabel(relationLabelToGet: string): Relation {
        return this.relations.find((singleRelation) => {
            return (singleRelation.label === relationLabelToGet);
        })
    }

    getRelationsWhereConceptIsUsed(conceptToBeUsed: Concept, relationToExclude?: Relation): Relation[] {
        if (conceptToBeUsed) {
            return this.relations.filter((singleRelation) => {
                return (singleRelation.conceptArgumentLabels.includes(conceptToBeUsed.label)
                    && singleRelation !== relationToExclude);
            })
        } else {
            return [];
        }
    }

    getConceptsUsedByRelation(relation: Relation, conceptToExclude: Concept): Concept[] {
        return this.concepts.filter((singleConcept) => {
            return (relation.conceptArgumentLabels.includes(singleConcept.label)
                && singleConcept !== conceptToExclude);
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

    private _generateStringForNode(curNode: Concept | Relation, prevNode?: Relation | Concept, curDepth?: number): string {
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

        const nextNodes: (Concept | Relation)[] = this._getNextNodes(curNode, prevNode);

        if (nextNodes?.length > 0) {
            curNodeString += "->";
        }
        if (isConcept(curNode) && prevNode) {
            curNodeString = "-" + curNodeString;
        }
        if (!isConcept(curNode) && prevNode) {
            curNodeString = "-" + curNodeString;
        }

        nextNodes?.forEach((singleNextNode) => {
            subNodesString += '\n' + leftPadding + this._generateStringForNode(singleNextNode, curNode, curDepth ? curDepth + 1 : 2)
        })
        return curNodeString + subNodesString;
    }

    private _getNextNodes(curNode: Relation | Concept, nodeToExclude: Relation | Concept): (Relation | Concept)[] {
        const nextNodesFound: (Concept | Relation)[] = [];
        if ((curNode as any).conceptTypeLabels) {
            const nextRelations: Relation[] = this.getRelationsWhereConceptIsUsed(curNode as Concept, nodeToExclude as Relation);
            nextNodesFound.push(...nextRelations);
        } else {
            const nextConcepts: Concept[] = this.getConceptsUsedByRelation(curNode as Relation, nodeToExclude as Concept);
            nextNodesFound.push(...nextConcepts);
        }
        return nextNodesFound;
    }
}