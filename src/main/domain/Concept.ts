import { ConceptType } from "./ConceptType";

export class Concept {
    id: ConceptId;
    conceptTypeLabels: string[] = [];
    label: string;
    referent: string;
}

export class ConceptId {
    conceptId: string;
    conceptualGraphId: string
}