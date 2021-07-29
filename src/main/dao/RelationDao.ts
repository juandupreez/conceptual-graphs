import { Relation } from "../domain/Relation";
import { RelationType } from "../domain/RelationType";

export interface RelationDao {
    createRelation(label: string, relationTypeLabel: string, conceptArguments: string[]): Relation;
}