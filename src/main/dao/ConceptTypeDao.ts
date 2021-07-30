import { ConceptType } from "../domain/ConceptType";

export interface SimpleConceptType {
    label: string;
    subConceptTypes?: SimpleConceptType[]
}
export interface ConceptTypeDao {
    createConceptType(newLabel: string, parentLabels?: string[]): ConceptType;
    // insertConceptType(conceptType: ConceptType, parentConceptTypes: ConceptType[]): ConceptType;
    insertConceptTypeAtRoot(conceptType: ConceptType): ConceptType;
    insertConceptTypeAsSubtype(subConceptType: ConceptType, parentConceptType: ConceptType): ConceptType;
    getConceptTypeById(conceptTypeId: string): ConceptType;
    getConceptTypeByLabel(label: string): ConceptType;
    getRootConceptTypes(): ConceptType[];
    // updateConceptType(concpetType: ConceptType): void;
    // deleteConceptType(conceptTypeId: string): void;
    generateHierarchyFromObject(hierarchyToGenerate: SimpleConceptType[]): void;
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