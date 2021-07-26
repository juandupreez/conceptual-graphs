import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { RelationTypeDao } from "../RelationTypeDao";

export class InMemoryRelationTypeDao implements RelationTypeDao {

    relationTypes: RelationType[] = [];
    rootRelationTypeIds: string[] = [];

    insertRelationTypeAtRoot(relationType: RelationType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationTypeId();
        relationType.id = generatedId;
        this.relationTypes.push(relationType);
        this.rootRelationTypeIds.push(generatedId);
        return generatedId;
    }
    
    getRelationTypeById(idToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.id === idToFind);
        })
        return foundRelationType;
    }
    
    insertRelationTypeAsSubtype(parentRelationType: RelationType, subRelationType: RelationType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationTypeId(); 
        subRelationType.id = generatedId;
        this.relationTypes.push(subRelationType);
        parentRelationType.subRelationTypeIds.push(subRelationType.id);
        subRelationType.parentRelationTypeIds.push(parentRelationType.id)
        return generatedId; 
    }

}