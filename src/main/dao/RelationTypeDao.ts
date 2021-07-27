import { RelationType } from "../domain/RelationType";

export interface SimpleRelationType {
    label: string;
    subRelationTypes?: SimpleRelationType[]
}
export interface RelationTypeDao {
    getRelationTypeByLabel(arg0: string): RelationType;
    getRootRelationTypes(): RelationType[];
    generateHierarchyFromObject(hierarchyToGenerate: SimpleRelationType[]);
    insertRelationTypeAsSubtype(parentRelationType: RelationType, subRelationType: RelationType): string;
    getRelationTypeById(generatedId: string): RelationType;
    insertRelationTypeAtRoot(relationType: RelationType): string;
}