import { ConceptType } from "./ConceptType";

export class Concept {
    id: string;
    conceptTypeLabels: string[] = [];
    label: string;
    referent: string;
}