import { RelationType } from "./RelationType";

export class Relation {
    relationType: RelationType;
    id: RelationId;
    label: string;
    relationTypeLabels: string[] = [];
    conceptArgumentLabels: string[] = [];
}

export class RelationId {
    relationId: string;
    conceptualGraphId: string;
}