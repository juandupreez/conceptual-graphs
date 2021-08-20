import { ConceptType } from "../domain/ConceptType";

export interface SimpleConceptType {
    label: string;
    subConceptTypes?: SimpleConceptType[]
}
export interface ConceptTypeDao {
    createConceptType(newLabel: string, parentLabels?: string[]): ConceptType;
    getConceptTypeById(conceptTypeId: string): ConceptType;
    getConceptTypeByLabel(label: string): ConceptType;
    getRootConceptTypes(): ConceptType[];
    getLabelAndAllSubLabelsOfConcept(labelOrLabels: string | string[]): string[];
    updateConceptType(concpetType: ConceptType): ConceptType;
    deleteConceptType(conceptTypeId: string): boolean;
    importHierarchyFromSimpleConceptTypes(hierarchyToGenerate: SimpleConceptType[]): void;
}

export class NoSuchConceptTypeError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NoSuchConceptTypeError.prototype);
    }
}

export class UniqueConceptTypeViolationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UniqueConceptTypeViolationError.prototype);
    }
}