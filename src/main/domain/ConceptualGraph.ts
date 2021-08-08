import { Concept } from "./Concept";
import { Relation } from "./Relation";

export class ConceptualGraph {

    concepts: Concept[] = [];
    relations: Relation[] = [];
    id: string;
    label: string;

    addConcept(concept: Concept) {
        this.concepts.push(concept);
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
        this.relations.push(relation);
    }

    createConcept(label: string, conceptTypeLabel: string, referent: string): Concept {
        const newConcept: Concept = new Concept();
        newConcept.label = label;
        newConcept.conceptTypeLabels.push(conceptTypeLabel);
        newConcept.referent = referent;
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

}