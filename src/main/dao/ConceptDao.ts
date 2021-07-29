import { Concept } from "../domain/Concept";

export interface ConceptDao {
    insertConcept(singleConcept: Concept);
    createConcept(label: string, conceptTypeLabel: string, referent: string): Concept;
}