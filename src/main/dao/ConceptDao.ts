import { Concept, ConceptId } from "../domain/Concept";

export interface ConceptDao {
    createConcept(conceptualGraphId: string, label: string, conceptTypeLabels: string[], referent: string): Concept;
    getConceptById(conceptIdToFind: ConceptId): Concept;
    getConceptByConceptualGraphIdAndLabel(conceptualGraphId: string, conceptLabel: string): Concept;
    updateConcept(conceptToUpdate: Concept): Concept;
    deleteConcept(id: ConceptId): boolean;
}