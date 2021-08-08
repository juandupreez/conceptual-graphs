import { Concept } from "../domain/Concept";

export interface ConceptDao {
    createConcept(label: string, conceptTypeLabels: string[], referent: string): Concept;
    getConceptById(conceptIdToFind: string): Concept;
    getConceptByLabel(conceptLabel: string): Concept;
    updateConcept(conceptToUpdate: Concept): Concept;
    deleteConcept(id: string): boolean;
}