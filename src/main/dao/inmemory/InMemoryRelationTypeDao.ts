import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { RelationTypeDao, SimpleRelationType } from "../RelationTypeDao";

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
    
    getRelationTypeByDescription(descriptionOfRelationTypeToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.description === descriptionOfRelationTypeToFind);
        })
        return foundRelationType;
    }

    getRootRelationTypes(): RelationType[] { 
        return this.rootRelationTypeIds.map((singleRootRelationTypeId) => {
            return this.getRelationTypeById(singleRootRelationTypeId);
        })
    }

    generateHierarchyFromObject(hierarchyToGenerate: SimpleRelationType[]) {
        hierarchyToGenerate.forEach((singleNewRelationType) => {
            // Insert current root node
            const rootRelationType: RelationType = new RelationType;
            rootRelationType.description = singleNewRelationType.description;
            this.insertRelationTypeAtRoot(rootRelationType);

            // insert child nodes recursively
            this.recursiveInsertSimpleRelationTypes(rootRelationType, singleNewRelationType.subRelationTypes);
        })   
    }

    recursiveInsertSimpleRelationTypes(parentRelationType: RelationType, subSimpleRelationTypes: SimpleRelationType[]) {
        if (parentRelationType && subSimpleRelationTypes) {
            subSimpleRelationTypes.forEach((singleNewSimpleRelationType) => {
                // See if current description exists
                const existingRelationType: RelationType = this.getRelationTypeByDescription(singleNewSimpleRelationType.description);
                if (existingRelationType) {
                    parentRelationType.subRelationTypeIds.push(existingRelationType.id);
                    existingRelationType.parentRelationTypeIds.push(parentRelationType.id);
                    this.recursiveInsertSimpleRelationTypes(existingRelationType, singleNewSimpleRelationType.subRelationTypes);    
                } else {                
                    // Insert current node
                    const newRelationType: RelationType = new RelationType;
                    newRelationType.description = singleNewSimpleRelationType.description;
                    this.insertRelationTypeAsSubtype(parentRelationType, newRelationType);
    
                    // Insert child nodes recursively
                    this.recursiveInsertSimpleRelationTypes(newRelationType, singleNewSimpleRelationType.subRelationTypes);

                }
            })
        }
    }

}