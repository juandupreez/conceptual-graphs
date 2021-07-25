import { RelationType } from "../domain/RelationType";

export interface RelationTypeDao {
    getRelationTypeById(generatedId: string): RelationType;
    insertRelationTypeAtRoot(relationType: RelationType): string;
}