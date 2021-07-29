import { RelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao } from "../ConceptTypeDao";
import { RelationTypeDao, SimpleRelationType } from "../RelationTypeDao";
import { Store } from "./store/Store";

export class InMemoryRelationTypeDao implements RelationTypeDao {

    relationTypes: RelationType[] = Store.getInstance().state.relationTypes;
    rootRelationTypeIds: string[] = Store.getInstance().state.rootRelationTypeIds;

    constructor(relationTypeDao: ConceptTypeDao) {

    }

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
    
    getRelationTypeByLabel(labelOfRelationTypeToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.label === labelOfRelationTypeToFind);
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
            rootRelationType.label = singleNewRelationType.label;
            this.insertRelationTypeAtRoot(rootRelationType);

            // insert child nodes recursively
            this.recursiveInsertSimpleRelationTypes(rootRelationType, singleNewRelationType.subRelationTypes);
        })   
    }

    recursiveInsertSimpleRelationTypes(parentRelationType: RelationType, subSimpleRelationTypes: SimpleRelationType[]) {
        if (parentRelationType && subSimpleRelationTypes) {
            subSimpleRelationTypes.forEach((singleNewSimpleRelationType) => {
                // See if current label exists
                const existingRelationType: RelationType = this.getRelationTypeByLabel(singleNewSimpleRelationType.label);
                if (existingRelationType) {
                    parentRelationType.subRelationTypeIds.push(existingRelationType.id);
                    existingRelationType.parentRelationTypeIds.push(parentRelationType.id);
                    this.recursiveInsertSimpleRelationTypes(existingRelationType, singleNewSimpleRelationType.subRelationTypes);    
                } else {                
                    // Insert current node
                    const newRelationType: RelationType = new RelationType;
                    newRelationType.label = singleNewSimpleRelationType.label;
                    this.insertRelationTypeAsSubtype(parentRelationType, newRelationType);
    
                    // Insert child nodes recursively
                    this.recursiveInsertSimpleRelationTypes(newRelationType, singleNewSimpleRelationType.subRelationTypes);

                }
            })
        }
    }

    createRelationType(newRelationTypeLabel: string, conceptTypeLabelsInSignature: string[], 
        parentLabels?: string[]): RelationType {
        const newRelationType: RelationType = new RelationType();
        newRelationType.label = newRelationTypeLabel;
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationTypeId();
        newRelationType.id = generatedId;
        newRelationType.signature = conceptTypeLabelsInSignature;
        this.relationTypes.push(newRelationType);

        if (parentLabels) {
            parentLabels.forEach((singleParentLabel) => {
                const parentRelationType = this.getRelationTypeByLabel(singleParentLabel);
                parentRelationType.subRelationTypeIds.push(newRelationType.id);
                newRelationType.parentRelationTypeIds.push(parentRelationType.id);
            });
        } else {
            this.rootRelationTypeIds.push(generatedId);
        }
        return newRelationType;
    }

}