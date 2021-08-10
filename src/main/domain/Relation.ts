import { RelationType } from "./RelationType";

export class Relation {
    id: string;
    label: string;
    relationTypeLabels: string[] = [];
    conceptArgumentLabels: string[] = [];
}