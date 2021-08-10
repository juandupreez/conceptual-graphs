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

    createConcept(label: string, conceptTypeLabels: string | string[], referent: string | Referent): Concept {
        const newConcept: Concept = new Concept();
        newConcept.label = label;
        if (typeof conceptTypeLabels === "string") {
            newConcept.conceptTypeLabels.push(conceptTypeLabels);
        } else if (conceptTypeLabels && conceptTypeLabels.length > 0) {
            conceptTypeLabels.forEach((singleConceptTypeLabel) => {
                newConcept.conceptTypeLabels.push(singleConceptTypeLabel);                
            });
        }
        if (typeof referent === "string") {
            
        newConcept.referent = {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LITERAL,
            designatorValue: referent
        };
        } else {
            newConcept.referent = referent;
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

}