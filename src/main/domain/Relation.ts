export interface SimpleRelation {
    label: string;
    relationTypeLabels: string[];
    conceptArgumentLabels: string[];
}
export class Relation {
    id: string;
    label: string;
    relationTypeLabels: string[] = [];
    conceptArgumentLabels: string[] = [];
}