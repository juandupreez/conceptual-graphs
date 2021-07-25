import { ConceptType } from "../../domain/ConceptType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao, SimpleConceptType } from "../ConceptTypeDao";

export class InMemoryConceptTypeDao implements ConceptTypeDao {

    conceptTypes: ConceptType[] = [];
    rootConceptTypeIds: string[] = [];

    insertConceptTypeAtRoot(conceptType: ConceptType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        conceptType.id = generatedId;
        this.conceptTypes.push(conceptType);
        this.rootConceptTypeIds.push(generatedId);
        return generatedId;
    }
    
    getConceptTypeById(idToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.id === idToFind);
        })
        return foundConceptType;
    }

    getConceptTypeByDescription(descriptionOfConceptTypeToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.description === descriptionOfConceptTypeToFind);
        })
        return foundConceptType;
    }

    getRootConceptTypes(): ConceptType[] {        
        return this.rootConceptTypeIds.map((singleRootConceptTypeId) => {
            return this.getConceptTypeById(singleRootConceptTypeId);
        })
    }

    insertConceptTypeAsSubtype(parentConceptType: ConceptType, subConceptType: ConceptType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId(); 
        subConceptType.id = generatedId;
        this.conceptTypes.push(subConceptType);
        parentConceptType.subConceptTypeIds.push(subConceptType.id);
        subConceptType.parentConceptTypeIds.push(parentConceptType.id)
        return generatedId;      
    }
    
    generateHierarchyFromObject(hierarchyToGenerate: SimpleConceptType[]) {
        hierarchyToGenerate.forEach((singleNewConceptType) => {
            // Insert current root node
            const rootConceptType: ConceptType = new ConceptType;
            rootConceptType.description = singleNewConceptType.description;
            this.insertConceptTypeAtRoot(rootConceptType);

            // insert child nodes recursively
            this.recursiveInsertSimpleConceptTypes(rootConceptType, singleNewConceptType.subConceptTypes);
        })        
    }

    recursiveInsertSimpleConceptTypes(parentConceptType: ConceptType, subSimpleConceptTypes: SimpleConceptType[]) {
        if (parentConceptType && subSimpleConceptTypes) {
            subSimpleConceptTypes.forEach((singleNewSimpleConceptType) => {
                // See if current description exists
                const existingConceptType: ConceptType = this.getConceptTypeByDescription(singleNewSimpleConceptType.description);
                if (existingConceptType) {
                    parentConceptType.subConceptTypeIds.push(existingConceptType.id);
                    existingConceptType.parentConceptTypeIds.push(parentConceptType.id);
                    this.recursiveInsertSimpleConceptTypes(existingConceptType, singleNewSimpleConceptType.subConceptTypes);    
                } else {                
                    // Insert current node
                    const newConceptType: ConceptType = new ConceptType;
                    newConceptType.description = singleNewSimpleConceptType.description;
                    this.insertConceptTypeAsSubtype(parentConceptType, newConceptType);
    
                    // Insert child nodes recursively
                    this.recursiveInsertSimpleConceptTypes(newConceptType, singleNewSimpleConceptType.subConceptTypes);

                }
            })
        }
    }

}