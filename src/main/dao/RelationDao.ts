import { Relation, RelationId } from "../domain/Relation";

export interface RelationDao {
    createRelation(conceptualGraphId: string, label: string, relationTypeLabels: string[], conceptArgumentLabels: string[]): Relation;
    getRelationById(relationIdToFind: RelationId): Relation;
    getRelationByConceptualGraphIdAndLabel(conceptualGraphId: string, relationLabel: string): Relation;
    updateRelation(relationToUpdate: Relation): Relation;
    deleteRelation(id: RelationId): boolean;
}