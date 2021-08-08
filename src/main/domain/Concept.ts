import { ConceptType } from "./ConceptType";

export class Concept {
    id: string;
    label: string;
    conceptTypeLabels: string[] = [];
    referent: string;
}