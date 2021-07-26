import { RelationType } from "../domain/RelationType";

export interface SimpleRelationType {
    description: string;
    subRelationTypes?: SimpleRelationType[]
}
export interface RelationTypeDao {
    getRelationTypeByDescription(arg0: string): RelationType;
    getRootRelationTypes(): RelationType[];
    generateHierarchyFromObject(hierarchyToGenerate: SimpleRelationType[]);
    insertRelationTypeAsSubtype(parentRelationType: RelationType, subRelationType: RelationType): string;
    getRelationTypeById(generatedId: string): RelationType;
    insertRelationTypeAtRoot(relationType: RelationType): string;
}