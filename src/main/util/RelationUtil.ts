import { Relation } from "../domain/Relation";

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