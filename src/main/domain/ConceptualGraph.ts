import { Concept } from "./Concept";
import { ConceptRelationEdge } from "./ConceptRelationEdge";
import { Relation } from "./Relation";

export class ConceptualGraph {

    concepts: Concept[] = [];
    relations: Relation[] = [];
    edges: ConceptRelationEdge[] = [];
    id: string;

    addConcept(concept: Concept) {
        this.concepts.push(concept);
    }

    addRelation(relation: Relation, conceptArgs: Concept[]) {
        this.relations.push(relation);
        conceptArgs.forEach((singleConceptArg, index) => {
            const conceptRelationEdge: ConceptRelationEdge = new ConceptRelationEdge();
            conceptRelationEdge.conceptLabel = singleConceptArg.label;
            conceptRelationEdge.relationLabel = relation.label;
            if (index === 0) {
                conceptRelationEdge.isFromConceptToRelation = true;
            }
            this.edges.push(conceptRelationEdge);
        })
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
        newRelation.conceptArguments.push(...conceptArguments.map((singleConceptArgument: Concept) => {
            return singleConceptArgument.label;
        }));
        this.relations.push(newRelation);
        this.linkConceptsToRelation(newRelation, conceptArguments);
        return newRelation;
    }

    linkConceptsToRelation(relation: Relation, concepts: Concept[]) {
        concepts.forEach((singleConcept: Concept, index) => {
            const newEdge: ConceptRelationEdge = new ConceptRelationEdge();
            newEdge.conceptLabel = singleConcept.label;
            newEdge.relationLabel = relation.label;
            if (index === 0) {
                newEdge.isFromConceptToRelation = true;
            } else {
                newEdge.isFromConceptToRelation = false;
            }
            this.edges.push(newEdge);
        })
    }

}