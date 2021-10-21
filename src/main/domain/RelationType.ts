
export interface SimpleRelationType {
    label: string;
    signature: string[];
    subRelationTypes?: SimpleRelationType[];
}

export class RelationType {
    id: string;
    label: string;
    subRelationTypeLabels: string[] = [];
    parentRelationTypeLabels: string[] = [];
    signature: string[];
}