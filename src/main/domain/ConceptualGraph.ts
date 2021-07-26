import { Concept } from "./Concept";
import { ConceptRelationEdge } from "./ConceptRelationEdge";
import { Relation } from "./Relation";

export class ConceptualGraph {

    concepts: Concept[] = [];
    relations: Relation[] = [];
    edges: ConceptRelationEdge[] = [];

    addConcept(concept: Concept) {
        this.concepts.push(concept);
    }

    addRelation(relation: Relation, conceptArgs: Concept[]) {
        this.relations.push(relation);
        conceptArgs.forEach((singleConceptArg, index) => {
            const conceptRelationEdge: ConceptRelationEdge = new ConceptRelationEdge();
            conceptRelationEdge.conceptId = singleConceptArg.id;
            conceptRelationEdge.relationId = relation.id;
            if (index === 0) {
                conceptRelationEdge.isFromConceptToRelation = true;
            }
            this.edges.push(conceptRelationEdge);
        })
    }

}