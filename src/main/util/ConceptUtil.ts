import { Concept, DesignatorType } from "../domain/Concept";
import { Relation } from "../domain/Relation";

export function hasAnyConceptTypes(concept: Concept, possibleConceptTypeLabels: string[]): boolean {
    for (let i = 0; i < possibleConceptTypeLabels.length; i++) {
        const singlePossibleConceptTypeLabel = possibleConceptTypeLabels[i];
        if (hasConceptType(concept, singlePossibleConceptTypeLabel)) {
            return true;
        }
    }
    return false;
}

export function hasConceptType(concept: Concept, possibleConceptTypeLabel: string): boolean {
    return concept.conceptTypeLabels.includes(possibleConceptTypeLabel);
}

export function cloneConcept(conceptToClone: Concept): Concept {
    return conceptToClone ? {
        ...conceptToClone,
        id: conceptToClone.id,
        conceptTypeLabels: [...conceptToClone.conceptTypeLabels]
    } : conceptToClone;
}

export function isConcept(conceptOrRelation: Concept | Relation): boolean {
    return ((conceptOrRelation as Concept)?.conceptTypeLabels) ? true : false;
}

export function conceptToString(concept: Concept): string {
    let conceptString: string = "["
        + concept.conceptTypeLabels.join("/");
    if (concept.referent.designatorType === DesignatorType.LAMBDA) {
        conceptString += ": ?" + concept.referent.designatorValue;
    } else if (concept.referent.designatorType !== DesignatorType.BLANK) {
        conceptString += ": " + concept.referent.designatorValue;
    }
    conceptString += "]";
    return conceptString;
}