import { ConceptType, SimpleConceptType } from "../../domain/ConceptType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao, NoSuchConceptTypeError, UniqueConceptTypeViolationError } from "../ConceptTypeDao";
import { Store } from "./store/Store";

export class InMemoryConceptTypeDao implements ConceptTypeDao {

    conceptTypes: ConceptType[] = Store.getInstance().state.conceptTypes;
    rootConceptTypeIds: string[] = Store.getInstance().state.rootConceptTypeIds;

    createConceptType(newConceptTypeLabel: string, parentLabels?: string[]): ConceptType {
        if (parentLabels && parentLabels.includes(newConceptTypeLabel)) {
            throw new Error(`Could not create concept '${newConceptTypeLabel}'. A concept cannot reference itself as parent`);
        }
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
        return this._clone(newConceptType);
    }

    getConceptTypeById(idToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.id === idToFind);
        })
        return foundConceptType ? this._clone(foundConceptType) : foundConceptType;
    }

    getConceptTypeByLabel(labelOfConceptTypeToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.label === labelOfConceptTypeToFind);
        })
        return foundConceptType ? this._clone(foundConceptType) : foundConceptType;
    }

    getRootConceptTypes(): ConceptType[] {
        return this.rootConceptTypeIds.map((singleRootConceptTypeId) => {
            return this.getConceptTypeById(singleRootConceptTypeId);
        })
    }

    getLabelAndAllSubLabelsOfConcept(labelOrLabels: string | string[]): string[] {
        if (typeof labelOrLabels === 'string') {
            return this._getLabelAndAllSubLabelsOfConcept(labelOrLabels, []);
        } else {
            return labelOrLabels?.reduce((accumulator, singleLabel) => {
                accumulator.push(...this._getLabelAndAllSubLabelsOfConcept(singleLabel, []));
                return accumulator;
            }, [])
        }
    }

    _getLabelAndAllSubLabelsOfConcept(label: string, labelsGottenSoFar: string[]): string[] {
        if (!labelsGottenSoFar.includes(label)) {
            const toReturn = [label, ...labelsGottenSoFar];
            const conceptType: ConceptType = this.getConceptTypeByLabel(label);
            conceptType?.subConceptTypeLabels.forEach((singleSubConceptTypeLabel) => {
                toReturn.push(...this._getLabelAndAllSubLabelsOfConcept(singleSubConceptTypeLabel, labelsGottenSoFar));
            })
            return toReturn;
        } else {
            return [];
        }
    }

    updateConceptType(conceptTypeToUpdate: ConceptType): ConceptType {
        this._validateConceptTypeToUpdate(conceptTypeToUpdate);

        const oldConceptType: ConceptType = this.getConceptTypeById(conceptTypeToUpdate.id);

        // Update Labels of the item, parent references, and sub references
        this.conceptTypes.forEach((singleConceptType: ConceptType) => {
            if (singleConceptType.id === conceptTypeToUpdate.id) {
                singleConceptType.label = conceptTypeToUpdate.label;
            }
            const indexOfOldLabelInParents: number = singleConceptType.parentConceptTypeLabels.indexOf(oldConceptType.label);
            if (indexOfOldLabelInParents !== -1) {
                singleConceptType.parentConceptTypeLabels[indexOfOldLabelInParents] = conceptTypeToUpdate.label;
            }
            const indexOfOldLabelInSubs: number = singleConceptType.subConceptTypeLabels.indexOf(oldConceptType.label);
            if (indexOfOldLabelInSubs !== -1) {
                singleConceptType.subConceptTypeLabels[indexOfOldLabelInSubs] = conceptTypeToUpdate.label;
            }
        })

        // Update structure: Parent structure
        this.conceptTypes.forEach((singleConceptType: ConceptType) => {
            if (conceptTypeToUpdate.parentConceptTypeLabels.includes(singleConceptType.label)) {
                if (!singleConceptType.subConceptTypeLabels.includes(conceptTypeToUpdate.label)) {
                    singleConceptType.subConceptTypeLabels.push(conceptTypeToUpdate.label);
                }
            }
            if (conceptTypeToUpdate.id === singleConceptType.id) {
                singleConceptType.parentConceptTypeLabels = conceptTypeToUpdate.parentConceptTypeLabels;
            }
        })

        // Update structure: Child structure
        this.conceptTypes.forEach((singleConceptType: ConceptType) => {
            if (conceptTypeToUpdate.subConceptTypeLabels.includes(singleConceptType.label)) {
                if (!singleConceptType.parentConceptTypeLabels.includes(conceptTypeToUpdate.label)) {
                    singleConceptType.parentConceptTypeLabels.push(conceptTypeToUpdate.label);
                }
                if (singleConceptType.parentConceptTypeLabels.length > 0) {
                    // Remove from root if sub concept type has parents
                    this.rootConceptTypeIds = this.rootConceptTypeIds.filter((singleRootConceptType) => {
                        return (singleRootConceptType !== singleConceptType.id);
                    })
                }
            }
            if (conceptTypeToUpdate.id === singleConceptType.id) {
                singleConceptType.subConceptTypeLabels = conceptTypeToUpdate.subConceptTypeLabels;
            }
            // If removed child
            if (singleConceptType.parentConceptTypeLabels.includes(conceptTypeToUpdate.label)
                && !conceptTypeToUpdate.subConceptTypeLabels.includes(singleConceptType.label)) {
                if (!this.rootConceptTypeIds.includes(singleConceptType.id)) {
                    // Add to root if sub concept type has no parents
                    this.rootConceptTypeIds.push(singleConceptType.id);
                }
            }
        })

        if (conceptTypeToUpdate.parentConceptTypeLabels.length > 0) {
            // Remove from root if concept type to update has parents
            this.rootConceptTypeIds = this.rootConceptTypeIds.filter((singleRootConceptType) => {
                return (singleRootConceptType !== conceptTypeToUpdate.id);
            })

        } else if (!this.rootConceptTypeIds.includes(conceptTypeToUpdate.id)) {
            // Add to root if concept type to update has no parents
            this.rootConceptTypeIds.push(conceptTypeToUpdate.id);
        }


        return this.getConceptTypeByLabel(conceptTypeToUpdate.label);
    }

    _validateConceptTypeToUpdate(conceptTypeToUpdate: ConceptType): void {
        // Cannot update concept if there is no id
        if (!conceptTypeToUpdate.id) {
            throw new Error(`Could not update concept type with label: ${conceptTypeToUpdate.label}. Id is ${conceptTypeToUpdate.id}.`);
        }

        // Cannot update a concept label to an existing label
        const existingConceptType: ConceptType = this.getConceptTypeByLabel(conceptTypeToUpdate.label);
        if (existingConceptType && existingConceptType.id !== conceptTypeToUpdate.id) {
            throw new Error(`Could not update concept type with label: ${conceptTypeToUpdate.label}. Id is ${conceptTypeToUpdate.id}. A concept type with that label already exists with id ${existingConceptType.id}`);
        }

        // Cannot relate to itself
        if (conceptTypeToUpdate.subConceptTypeLabels.includes(conceptTypeToUpdate.label)) {
            throw new Error(`Could not update concept type with label: ${conceptTypeToUpdate.label}. One of the sub concept types is listed as itself`);
        }
        if (conceptTypeToUpdate.parentConceptTypeLabels.includes(conceptTypeToUpdate.label)) {
            throw new Error(`Could not update concept type with label: ${conceptTypeToUpdate.label}. One of the parent concept types is listed as itself`);
        }

        // Referenced concept types must exist
        conceptTypeToUpdate.parentConceptTypeLabels.forEach((singleParentConceptTypeLabel: string) => {
            const parentConceptType: ConceptType = this.getConceptTypeByLabel(singleParentConceptTypeLabel);
            if (!parentConceptType) {
                throw new NoSuchConceptTypeError(`Could not update concept type with label: ${conceptTypeToUpdate.label}. No such parent concept type: ${singleParentConceptTypeLabel}`);
            }
        })
        conceptTypeToUpdate.subConceptTypeLabels.forEach((singleSubConceptTypeLabel: string) => {
            const parentConceptType: ConceptType = this.getConceptTypeByLabel(singleSubConceptTypeLabel);
            if (!parentConceptType) {
                throw new NoSuchConceptTypeError(`Could not update concept type with label: ${conceptTypeToUpdate.label}. No such sub concept type: ${singleSubConceptTypeLabel}`);
            }
        })
    }

    deleteConceptType(conceptTypeIdToDelete: string): boolean {
        let successfulDelete: boolean = false;
        const conceptTypeCountBefore: number = this.conceptTypes.length;
        const conceptTypeToDelete: ConceptType = this.getConceptTypeById(conceptTypeIdToDelete);
        if (!conceptTypeToDelete) {
            return false;
        }
        Store.getInstance().state.conceptTypes = this.conceptTypes.filter((singleConceptType: ConceptType) => {
            return (singleConceptType.id !== conceptTypeIdToDelete);
        })
        this.conceptTypes = Store.getInstance().state.conceptTypes;
        this.rootConceptTypeIds.filter((singleConceptTypeId: string) => {
            return (singleConceptTypeId !== conceptTypeIdToDelete);
        })
        this.conceptTypes.forEach((singleConceptType: ConceptType) => {
            if (singleConceptType.subConceptTypeLabels.includes(conceptTypeToDelete.label)) {
                singleConceptType.subConceptTypeLabels = singleConceptType.subConceptTypeLabels.filter((singleSubConceptTypeLabel) => {
                    return (singleSubConceptTypeLabel !== conceptTypeToDelete.label);
                })
            }
            if (singleConceptType.parentConceptTypeLabels.includes(conceptTypeToDelete.label)) {
                singleConceptType.parentConceptTypeLabels = singleConceptType.parentConceptTypeLabels.filter((singleParentConceptTypeLabel) => {
                    return (singleParentConceptTypeLabel !== conceptTypeToDelete.label);
                })
                if (singleConceptType.parentConceptTypeLabels.length === 0) {
                    if (!this.rootConceptTypeIds.includes(singleConceptType.id)) {
                        this.rootConceptTypeIds.push(singleConceptType.id);
                    }
                }
            }
        })
        if (this.conceptTypes.length === (conceptTypeCountBefore - 1)) {
            successfulDelete = true;
        }
        return successfulDelete;
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

    _clone(conceptTypeToClone: ConceptType): ConceptType {
        return {
            ...conceptTypeToClone,
            parentConceptTypeLabels: [...conceptTypeToClone.parentConceptTypeLabels],
            subConceptTypeLabels: [...conceptTypeToClone.subConceptTypeLabels]
        }
    }

}