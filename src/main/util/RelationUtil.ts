import { Concept } from "../conceptual-graphs";
import { Relation } from "../domain/Relation";
import { MatchedRelation } from "../query/QueryManager";

export function cloneRelation(relationToClone: Relation): Relation {
    return relationToClone ? {
        ...relationToClone,
        id: relationToClone.id,
        relationTypeLabels: [...relationToClone.relationTypeLabels],
        conceptArgumentLabels: [...relationToClone.conceptArgumentLabels]
    } : relationToClone;
}


export function relationToString(relation: Relation): string {
    let conceptString: string = "("
        + relation.relationTypeLabels.join("/")
        + " - \"" + relation.label + "\""
        + ")";
    return conceptString
}

export function matchedRelationToRelation(matchedRelation: MatchedRelation): Relation {
    const matchedRelationClone: MatchedRelation = (cloneRelation(matchedRelation) as MatchedRelation);
    delete matchedRelationClone.templateRelationLabelWhichWasMatched;
    return matchedRelationClone;
}

export function createRelation(label: string, relationType: string | string[], conceptArguments: Concept[]): Relation {
    const newRelation: Relation = new Relation();
    newRelation.label = label;
    if (typeof relationType === 'string') {
        newRelation.relationTypeLabels.push(relationType);
    } else {
        newRelation.relationTypeLabels.push(...relationType);
    }
    newRelation.conceptArgumentLabels.push(...conceptArguments.map((singleConceptArgument: Concept) => {
        return singleConceptArgument.label;
    }));
    return newRelation;
}