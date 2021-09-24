import { RelationType, SimpleRelationType } from "../domain/RelationType";

export interface RelationTypeDao {
    createRelationType(newLabel: string, signatureConceptTypeLabels: string[], parentLabels?: string[]): RelationType;
    getRelationTypeById(relationTypeId: string): RelationType;
    getRelationTypeByLabel(label: string): RelationType;
    getRootRelationTypes(): RelationType[];
    getLabelAndAllSubLabelsOfRelation(singleRelationTypeLabel: string | string[]): string[];
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