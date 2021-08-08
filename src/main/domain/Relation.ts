import { RelationType } from "./RelationType";

export class Relation {
    relationType: RelationType;
    id: string;
    label: string;
    relationTypeLabels: string[] = [];
    conceptArgumentLabels: string[] = [];
}