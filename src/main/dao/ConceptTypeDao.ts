import { ConceptType } from "../domain/ConceptType";

export interface SimpleConceptType {
    label: string;
    subConceptTypes?: SimpleConceptType[]
}
export interface ConceptTypeDao {
    getConceptTypeByLabel(arg0: string);
    getRootConceptTypes(): any;
    generateHierarchyFromObject(hierarchyToGenerate: SimpleConceptType[]);
    insertConceptTypeAsSubtype(parentConceptType: ConceptType, subConceptType: ConceptType): string;
    getConceptTypeById(generatedId: string): ConceptType;
    insertConceptTypeAtRoot(conceptType: ConceptType): string;
}