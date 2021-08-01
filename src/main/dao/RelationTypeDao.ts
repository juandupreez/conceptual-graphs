import { RelationType } from "../domain/RelationType";

export interface SimpleRelationType {
    label: string;
    subRelationTypes?: SimpleRelationType[]
}
export interface RelationTypeDao {
    createRelationType(newLabel: string, parentLabels?: string[]): RelationType;
    getRelationTypeById(relationTypeId: string): RelationType;
    getRelationTypeByLabel(label: string): RelationType;
    getRootRelationTypes(): RelationType[];
    updateRelationType(concpetType: RelationType): RelationType;
    deleteRelationType(relationTypeId: string): boolean;
    importHierarchyFromSimpleRelationTypes(hierarchyToGenerate: SimpleRelationType[]): void;
}

export class NoSuchRelationTypeError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NoSuchRelationTypeError.prototype);
    }
}

export class UniqueRelationTypeViolationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UniqueRelationTypeViolationError.prototype);
    }
}