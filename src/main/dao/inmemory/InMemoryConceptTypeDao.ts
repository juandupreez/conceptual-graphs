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
                const transientParentConceptType = this.getConceptTypeByLabel(singleParentLabel);
                if (!transientParentConceptType) {
                    throw new NoSuchConceptTypeError(`Could not create concept '${newConceptTypeLabel}'. No parent concept type with label: '${singleParentLabel}'.`);
                }
                for (let i = 0; i < this.conceptTypes.length; i++) {
                    const singleConceptType = this.conceptTypes[i];
                    if (transientParentConceptType.id === singleConceptType.id) {
                        singleConceptType.subConceptTypeLabels.push(newConceptType.label);
                    }               
                }
                newConceptType.parentConceptTypeLabels.push(singleParentLabel);
            });
        } else {
            this.rootConceptTypeIds.push(generatedId);
        }
        return { ...newConceptType };
    }

    getConceptTypeById(idToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.id === idToFind);
        })
        return foundConceptType ? { ...foundConceptType } : foundConceptType;
    }

    getConceptTypeByLabel(labelOfConceptTypeToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.label === labelOfConceptTypeToFind);
        })
        return foundConceptType ? { ...foundConceptType } : foundConceptType;
    }

    getRootConceptTypes(): ConceptType[] {
        return this.rootConceptTypeIds.map((singleRootConceptTypeId) => {
            return this.getConceptTypeById(singleRootConceptTypeId);
        })
    }

    importHierarchyFromSimpleConceptTypes(hierarchyToGenerate: SimpleConceptType[]): void {
        hierarchyToGenerate.forEach((singleNewConceptType) => {
            // Insert current root node
            const rootConceptType: ConceptType = this.createConceptType(singleNewConceptType.label);

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
                    for (let i = 0; i < this.conceptTypes.length; i++) {
                        const element = this.conceptTypes[i];
                        if (element.id === parentConceptType.id) {
                            element.subConceptTypeLabels.push(existingConceptType.label);
                        }
                        if (element.id === existingConceptType.id) {
                            element.parentConceptTypeLabels.push(parentConceptType.label);
                        }                        
                    }
                    this.recursiveInsertSimpleConceptTypes(existingConceptType, singleNewSimpleConceptType.subConceptTypes);
                } else {
                    // Insert current node
                    const newConceptType: ConceptType = this.createConceptType(singleNewSimpleConceptType.label, [parentConceptType.label]);

                    // Insert child nodes recursively
                    this.recursiveInsertSimpleConceptTypes(newConceptType, singleNewSimpleConceptType.subConceptTypes);
                }
            })
        }
    }

}