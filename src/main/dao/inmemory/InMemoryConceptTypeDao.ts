import { ConceptType } from "../../domain/ConceptType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao, SimpleConceptType, NoSuchConceptTypeError, UniqueConceptTypeViolationError } from "../ConceptTypeDao";
import { Store } from "./store/Store";

export class InMemoryConceptTypeDao implements ConceptTypeDao {

    conceptTypes: ConceptType[] = Store.getInstance().state.conceptTypes;
    rootConceptTypeIds: string[] = Store.getInstance().state.rootConceptTypeIds;

    createConceptType(newConceptTypeLabel: string, parentLabels?: string[]): ConceptType {
        if (this.getConceptTypeByLabel(newConceptTypeLabel)) {
            throw new UniqueConceptTypeViolationError(`Could not create concept '${newConceptTypeLabel}'. A concept with that label already exists.`);
        }

        const newConceptType: ConceptType = new ConceptType();
        newConceptType.label = newConceptTypeLabel;
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        newConceptType.id = generatedId;
        this.conceptTypes.push(newConceptType);

        if (parentLabels) {
            parentLabels.forEach((singleParentLabel) => {
                const parentConceptType = this.getConceptTypeByLabel(singleParentLabel);
                if (!parentConceptType) {
                    throw new NoSuchConceptTypeError(`Could not create concept '${newConceptTypeLabel}'. No parent concept type with label: '${singleParentLabel}'.`);
                }
                parentConceptType.subConceptTypeIds.push(newConceptType.id);
                newConceptType.parentConceptTypeIds.push(parentConceptType.id);
            });
        } else {
            this.rootConceptTypeIds.push(generatedId);
        }
        return newConceptType;
    }

    insertConceptTypeAtRoot(conceptType: ConceptType): ConceptType {
        if (conceptType.id) {
            throw new Error(`Cannot create concept. Expected id to be null but instead it was: '${conceptType.id}'`);
        }
        if (this.getConceptTypeByLabel(conceptType.label)) {
            throw new UniqueConceptTypeViolationError(`Could not create concept '${conceptType.label}'. A concept with that label already exists.`);
        }
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        conceptType.id = generatedId;
        this.conceptTypes.push(conceptType);
        this.rootConceptTypeIds.push(generatedId);
        return conceptType;
    }

    insertConceptTypeAsSubtype(subConceptType: ConceptType, parentConceptType: ConceptType): ConceptType {
        if (subConceptType.id) {
            throw new Error(`Cannot create concept. Expected id to be null but instead it was: '${subConceptType.id}'`);
        }
        if (this.getConceptTypeByLabel(subConceptType.label)) {
            throw new UniqueConceptTypeViolationError(`Could not create concept '${subConceptType.label}'. A concept with that label already exists.`);
        }
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        subConceptType.id = generatedId;
        this.conceptTypes.push(subConceptType);
        parentConceptType.subConceptTypeIds.push(subConceptType.id);
        subConceptType.parentConceptTypeIds.push(parentConceptType.id)
        return subConceptType;
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

    generateHierarchyFromObject(hierarchyToGenerate: SimpleConceptType[]): void {
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
                    this.insertConceptTypeAsSubtype(newConceptType, parentConceptType);

                    // Insert child nodes recursively
                    this.recursiveInsertSimpleConceptTypes(newConceptType, singleNewSimpleConceptType.subConceptTypes);

                }
            })
        }
    }

}