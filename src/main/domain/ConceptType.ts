export class ConceptType {
    id: string;
    description: string;
    subConceptTypeIds: string[] = [];
    parentConceptTypeIds: string[] = [];
}