import { ConceptType } from "../domain/ConceptType";

export interface ConceptTypeDao {
    insertConceptTypeAsSubtype(parentConceptType: ConceptType, subConceptType: ConceptType): string;
    getConceptTypeById(generatedId: string): ConceptType;
    insertConceptTypeAtRoot(conceptType: ConceptType): string;
}