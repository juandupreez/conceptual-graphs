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

    getConceptTypeByLabel(labelOfConceptTypeToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.label === labelOfConceptTypeToFind);
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
            rootConceptType.label = singleNewConceptType.label;
            this.insertConceptTypeAtRoot(rootConceptType);

            // insert child nodes recursively
            this.recursiveInsertSimpleConceptTypes(rootConceptType, singleNewConceptType.subConceptTypes);
        })
    }

    recursiveInsertSimpleConceptTypes(parentConceptType: ConceptType, subSimpleConceptTypes: SimpleConceptType[]) {
        if (parentConceptType && subSimpleConceptTypes) {
            subSimpleConceptTypes.forEach((singleNewSimpleConceptType) => {
                // See if current label exists
                const existingConceptType: ConceptType = this.getConceptTypeByLabel(singleNewSimpleConceptType.label);
                if (existingConceptType) {
                    parentConceptType.subConceptTypeIds.push(existingConceptType.id);
                    existingConceptType.parentConceptTypeIds.push(parentConceptType.id);
                    this.recursiveInsertSimpleConceptTypes(existingConceptType, singleNewSimpleConceptType.subConceptTypes);
                } else {
                    // Insert current node
                    const newConceptType: ConceptType = new ConceptType;
                    newConceptType.label = singleNewSimpleConceptType.label;
                    this.insertConceptTypeAsSubtype(parentConceptType, newConceptType);

                    // Insert child nodes recursively
                    this.recursiveInsertSimpleConceptTypes(newConceptType, singleNewSimpleConceptType.subConceptTypes);

                }
            })
        }
    }

    createConceptType(newConceptTypeLabel: string, parentLabels?: string[]): ConceptType {
        const newConceptType: ConceptType = new ConceptType();
        newConceptType.label = newConceptTypeLabel;
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        newConceptType.id = generatedId;
        this.conceptTypes.push(newConceptType);

        if (parentLabels) {
            parentLabels.forEach((singleParentLabel) => {
                const parentConceptType = this.getConceptTypeByLabel(singleParentLabel);
                parentConceptType.subConceptTypeIds.push(newConceptType.id);
                newConceptType.parentConceptTypeIds.push(parentConceptType.id);
            });
        } else {
            this.rootConceptTypeIds.push(generatedId);
        }
        return newConceptType;
    }

}