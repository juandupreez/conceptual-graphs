import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";

export interface RelationDao {
    createRelation(label: string, relationTypeLabels: string[], conceptArgumentLabels: string[]): Relation;
    getRelationById(relationIdToFind: string): Relation;
    getRelationByLabel(relationLabel: string): Relation;
    getRelationsByExample(relationToMatch: Relation, query?: ConceptualGraph)
    updateRelation(relationToUpdate: Relation): Relation;
    deleteRelation(id: string): boolean;
}