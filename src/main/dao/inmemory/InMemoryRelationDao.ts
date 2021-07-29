import { Relation } from "../../domain/Relation";
import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { RelationDao } from "../RelationDao";
import { RelationTypeDao } from "../RelationTypeDao";
import { Store } from "./store/Store";

export class InMemoryRelationDao implements RelationDao {
    relationTypeDao: RelationTypeDao;

    constructor(relationTypeDao: RelationTypeDao) {
        this.relationTypeDao = relationTypeDao;
    }

    createRelation(newRelationLabel: string, relationTypeLabel: string, conceptArguments: string[]): Relation {
        const newRelation: Relation = new Relation();
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationId();
        if (!newRelation.id) {
            newRelation.id = {
                relationId: null,
                conceptualGraphId: null
            }
        }
        newRelation.id.relationId = generatedId;
        newRelation.label = newRelationLabel;
        newRelation.relationTypeLabels.push(relationTypeLabel);
        newRelation.conceptArguments = conceptArguments;
        return newRelation;
    }

    insertRelation(singleRelation: Relation) {
        if (!singleRelation.id.relationId) {
            singleRelation.id.relationId = IdGenerator.getInstance().getNextUniqueRelationId();
        }
        Store.getInstance().state.relations.push(singleRelation);
    }

}