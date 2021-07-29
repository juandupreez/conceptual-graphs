import { Relation } from "../domain/Relation";
import { RelationType } from "../domain/RelationType";

export interface RelationDao {
    insertRelation(singleRelation: Relation);
    createRelation(label: string, relationTypeLabel: string, conceptArguments: string[]): Relation;
}