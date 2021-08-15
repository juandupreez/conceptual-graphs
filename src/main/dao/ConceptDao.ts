import { Concept, Referent } from "../domain/Concept";

export interface ConceptDao {
    createConcept(label: string, conceptTypeLabels: string[], referent: string | Referent): Concept;
    getConceptById(conceptIdToFind: string): Concept;
    getConceptByLabel(conceptLabel: string): Concept;
    getConceptsByExample(conceptToMatch: Concept);
    updateConcept(conceptToUpdate: Concept): Concept;
    deleteConcept(id: string): boolean;
}