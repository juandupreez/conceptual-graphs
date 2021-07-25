export class ConceptType {
    id: string;
    description: string;
    parentConceptTypeIds: string[] = [];
    subConceptTypeIds: string[] = [];
}