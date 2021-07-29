import { RelationType } from "./RelationType";

export class Relation {
    relationType: RelationType;
    id: {
        relationId: string,
        conceptualGraphId: string
    };
    label: string;
    relationTypeLabels: string[] = [];
    conceptArguments: string[] = [];
}