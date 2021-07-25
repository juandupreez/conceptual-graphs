import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { RelationTypeDao } from "../RelationTypeDao";

export class InMemoryRelationTypeDao implements RelationTypeDao {

    relationTypes: RelationType[] = [];

    insertRelationTypeAtRoot(relationType: RelationType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationTypeId();
        relationType.id = generatedId;
        this.relationTypes.push(relationType);
        return generatedId;
    }
    
    getRelationTypeById(idToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.id === idToFind);
        })
        return foundRelationType;
    }

}