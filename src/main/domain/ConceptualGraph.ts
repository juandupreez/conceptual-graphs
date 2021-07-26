import { Concept } from "./Concept";

export class ConceptualGraph {
    concepts: Concept[] = [];
    
    addConcept(concept: Concept) {
        this.concepts.push(concept);
    }

}