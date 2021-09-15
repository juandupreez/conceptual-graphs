export interface SimpleConceptType {
    label: string;
    subConceptTypes?: SimpleConceptType[]
}
export class ConceptType {
    id: string;
    label: string;
    parentConceptTypeLabels: string[] = [];
    subConceptTypeLabels: string[] = [];
}
