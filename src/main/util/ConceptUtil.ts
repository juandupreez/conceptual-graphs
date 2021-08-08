import { Concept } from "../domain/Concept";

export class ConceptUtil {

    static hasAnyConceptTypes(concept: Concept, possibleConceptTypeLabels: string[]): boolean {
        for (let i = 0; i < possibleConceptTypeLabels.length; i++) {
            const singlePossibleConceptTypeLabel = possibleConceptTypeLabels[i];
            if (this.hasConceptType(concept, singlePossibleConceptTypeLabel)) {
                return true;
            }
        }
        return false;
    }

    static hasConceptType(concept: Concept, possibleConceptTypeLabel: string): boolean {
        return concept.conceptTypeLabels.includes(possibleConceptTypeLabel);
    }
}