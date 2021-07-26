import { RelationType } from "../domain/RelationType";

export interface RelationTypeDao {
    insertRelationTypeAsSubtype(parentRelationType: RelationType, subRelationType: RelationType): string;
    getRelationTypeById(generatedId: string): RelationType;
    insertRelationTypeAtRoot(relationType: RelationType): string;
}