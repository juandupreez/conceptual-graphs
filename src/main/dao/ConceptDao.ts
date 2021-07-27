import { Concept } from "../domain/Concept";

export interface ConceptDao {
    createConcept(label: string, conceptTypeLabel: string, referent: string): Concept;
}