import { Concept, DesignatorType, Referent } from "../domain/Concept";
import { Relation } from "../domain/Relation";
import { MatchedConcept } from "../query/QueryManager";

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
        conceptString += ": ?" + concept.label;
    } else if (concept.referent.designatorType !== DesignatorType.BLANK) {
        conceptString += ": " + concept.referent.designatorValue;
    }
    conceptString += "]";
    return conceptString;
}

export function matchedConceptToConcept(matchedConcept: MatchedConcept): Concept {
    const matchedConceptClone: MatchedConcept = (cloneConcept(matchedConcept) as MatchedConcept);
    delete matchedConceptClone.templateConceptLabelWhichWasMatched;
    return matchedConceptClone;
}

export function createConcept(label: string, conceptTypeLabels: string | string[], referent?: string | Referent): Concept {
    const newConcept: Concept = new Concept();
    newConcept.label = label;
    if (typeof conceptTypeLabels === "string") {
        newConcept.conceptTypeLabels.push(conceptTypeLabels);
    } else if (conceptTypeLabels && conceptTypeLabels.length > 0) {
        conceptTypeLabels.forEach((singleConceptTypeLabel) => {
            newConcept.conceptTypeLabels.push(singleConceptTypeLabel);
        });
    }
    if (!referent) {
        newConcept.referent = {
            designatorType: DesignatorType.BLANK,
            designatorValue: undefined
        };
    } else if (typeof referent === "string") {
        if (referent === DesignatorType.LAMBDA) {
            newConcept.referent = {
                designatorType: DesignatorType.LAMBDA,
                designatorValue: undefined
            };
        } else {
            newConcept.referent = {
                designatorType: DesignatorType.LITERAL,
                designatorValue: referent
            };
        }
    } else {
        newConcept.referent = {
            designatorType: referent.designatorType,
            designatorValue: referent.designatorValue
        };
    }
    return newConcept;   
}