import { ConceptType } from "../ConceptType";

export interface ConceptTypeDao {
    getConceptTypeById(generatedId: string): ConceptType;
    insertConceptTypeAtRoot(conceptType: ConceptType): string;
}