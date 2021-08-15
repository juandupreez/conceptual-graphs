import { cloneConcept } from "../util/ConceptUtil";
import { cloneRelation } from "../util/RelationUtil";
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

    addConceptOrRelation(conceptOrRelation: Concept | Relation) {
        if ((conceptOrRelation as any).conceptTypeLabels) {
            this.addConcept(conceptOrRelation as Concept);
        } else if ((conceptOrRelation as any).relationTypeLabels) {
            this.addRelation(conceptOrRelation as Relation);
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
            newConcept.referent = {
                quantifierType: QuantifierType.A_SINGLE,
                quantifierValue: undefined,
                designatorType: DesignatorType.LITERAL,
                designatorValue: referent
            };
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

    getRelationsWhereConceptIsUsed(conceptToBeUsed: Concept, relationToExclude: Relation): Relation[] {
        return this.relations.filter((singleRelation) => {
            return (singleRelation.conceptArgumentLabels.includes(conceptToBeUsed.label)
                && singleRelation !== relationToExclude);
        })
    }

    getConceptsUsedByRelation(relation: Relation, conceptToExclude: Concept): Concept[] {
        return this.concepts.filter((singleConcept) => {
            return (relation.conceptArgumentLabels.includes(singleConcept.label)
                && singleConcept !== conceptToExclude);
        })
    }

}