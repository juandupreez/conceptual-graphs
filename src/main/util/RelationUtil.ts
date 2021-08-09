import { Relation } from "../domain/Relation";

export function cloneRelation(relationToClone: Relation): Relation {
    return relationToClone ? {
        ...relationToClone,
        id: relationToClone.id,
        relationTypeLabels: [...relationToClone.relationTypeLabels],
        conceptArgumentLabels: [...relationToClone.conceptArgumentLabels]
    } : relationToClone;
}