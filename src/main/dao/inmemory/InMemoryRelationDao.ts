import { Relation } from "../../domain/Relation";
import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { RelationDao } from "../RelationDao";
import { RelationTypeDao } from "../RelationTypeDao";

export class InMemoryRelationDao implements RelationDao{
    relationTypeDao: RelationTypeDao;

    constructor( relationTypeDao: RelationTypeDao) {
        this.relationTypeDao = relationTypeDao;
    }

    createRelation(newRelationLabel: string, relationTypeLabel: string, conceptArguments: string[]): Relation {
        const newRelation: Relation = new Relation();
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationId();
        newRelation.id = generatedId;
        newRelation.label = newRelationLabel;
        newRelation.relationTypeLabels.push(relationTypeLabel);
        newRelation.conceptArguments = conceptArguments;
        return newRelation;
    }

}