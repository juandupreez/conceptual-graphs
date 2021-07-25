import { ConceptType } from "../domain/ConceptType";

export interface SimpleConceptType {
    description: string;
    subConceptTypes?: SimpleConceptType[]
}
export interface ConceptTypeDao {
    getConceptTypeByDescription(arg0: string);
    getRootConceptTypes(): any;
    generateHierarchyFromObject(hierarchyToGenerate: SimpleConceptType[]);
    insertConceptTypeAsSubtype(parentConceptType: ConceptType, subConceptType: ConceptType): string;
    getConceptTypeById(generatedId: string): ConceptType;
    insertConceptTypeAtRoot(conceptType: ConceptType): string;
}