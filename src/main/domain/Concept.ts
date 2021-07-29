import { ConceptType } from "./ConceptType";

export class Concept {
    id: {
        conceptId: string,
        conceptualGraphId: string
    };
    conceptTypeLabels: string[] = [];
    label: string;
    referent: string;
}