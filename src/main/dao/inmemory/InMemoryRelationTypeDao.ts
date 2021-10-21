import { ConceptType } from "../../domain/ConceptType";
import { RelationType, SimpleRelationType } from "../../domain/RelationType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao, NoSuchConceptTypeError } from "../ConceptTypeDao";
import { NoSuchRelationTypeError, UniqueRelationTypeViolationError } from "../RelationTypeDao";
import { RelationTypeDao } from "../RelationTypeDao";
import { Store } from "./store/Store";

export class InMemoryRelationTypeDao implements RelationTypeDao {
    relationTypes: RelationType[] = Store.getInstance().state.relationTypes;
    rootRelationTypeIds: string[] = Store.getInstance().state.rootRelationTypeIds;
    conceptTypeDao: ConceptTypeDao;

    constructor(conceptTypeDao: ConceptTypeDao) {
        this.conceptTypeDao = conceptTypeDao;
    }

    createRelationType(newRelationTypeLabel: string, signatureConceptTypeLabels: string[], parentLabels?: string[]): RelationType {
        this._validateRelationTypeBeforeCreate(newRelationTypeLabel, signatureConceptTypeLabels, parentLabels);

        const newRelationType: RelationType = new RelationType();
        newRelationType.label = newRelationTypeLabel;
        const generatedId = IdGenerator.getInstance().getNextUniqueRelationTypeId();
        newRelationType.id = generatedId;
        newRelationType.signature = signatureConceptTypeLabels;
        this.relationTypes.push(newRelationType);

        if (parentLabels) {
            parentLabels.forEach((singleParentLabel) => {
                const transientParentRelationType = this.getRelationTypeByLabel(singleParentLabel);
                if (!transientParentRelationType) {
                    throw new NoSuchRelationTypeError(`Could not create relation '${newRelationTypeLabel}'. No parent relation type with label: '${singleParentLabel}'.`);
                }
                for (let i = 0; i < this.relationTypes.length; i++) {
                    const singleRelationType = this.relationTypes[i];
                    if (transientParentRelationType.id === singleRelationType.id) {
                        singleRelationType.subRelationTypeLabels.push(newRelationType.label);
                    }
                }
                newRelationType.parentRelationTypeLabels.push(singleParentLabel);
            });
        } else {
            this.rootRelationTypeIds.push(generatedId);
        }
        return this._clone(newRelationType);
    }

    _validateRelationTypeBeforeCreate(newRelationTypeLabel: string, signatureConceptTypeLabels: string[], parentLabels?: string[]) {
        if (parentLabels && parentLabels.includes(newRelationTypeLabel)) {
            throw new Error(`Could not create relation '${newRelationTypeLabel}'. A relation cannot reference itself as parent`);
        }
        if (this.getRelationTypeByLabel(newRelationTypeLabel)) {
            throw new UniqueRelationTypeViolationError(`Could not create relation '${newRelationTypeLabel}'. A relation with that label already exists.`);
        }
        if (!signatureConceptTypeLabels || signatureConceptTypeLabels.length === 0) {
            throw new Error(`Could not create relation type with label: ${newRelationTypeLabel}. Signature needs at least one concept type`);
        }
        if (parentLabels) {
            parentLabels.forEach((parentRelationTypeLabel) => {
                const parentRelationType: RelationType = this.getRelationTypeByLabel(parentRelationTypeLabel);
                if (!parentRelationType) {
                    throw new NoSuchRelationTypeError(`Could not create relation '${newRelationTypeLabel}'. No parent relation type with label: '${parentRelationTypeLabel}'.`);
                }
                if (signatureConceptTypeLabels.length !== parentRelationType.signature.length) {
                    throw new Error('Could not create relation type with label: '
                        + newRelationTypeLabel
                        + '. Signature needs the same number of concept types as parent'
                        + parentRelationTypeLabel + '" (Signature: ' + parentRelationType.signature + ')');
                }
            })
        }
        signatureConceptTypeLabels.forEach((singleConceptTypeLabel) => {
            if (!this.conceptTypeDao.getConceptTypeByLabel(singleConceptTypeLabel)) {
                throw new NoSuchConceptTypeError(`Could not create relation type with label: ${newRelationTypeLabel}. No such concept type: ${singleConceptTypeLabel}`);
            }
        })
        if (parentLabels) {
            signatureConceptTypeLabels.forEach((singleSignatureLabel, singleSignatureIndex) => {
                const possibleSignatureConceptTypeLabels: string[] = [];
                parentLabels.forEach((singleParentLabel) => {
                    const parentRelationType: RelationType = this.getRelationTypeByLabel(singleParentLabel);
                    const conceptTypeLabelAndSubConceptTypeLabels: string[]
                        = this.conceptTypeDao.getLabelAndAllSubLabelsOfConceptType(parentRelationType.signature[singleSignatureIndex]);
                    possibleSignatureConceptTypeLabels.push(...conceptTypeLabelAndSubConceptTypeLabels);
                })
                if (!possibleSignatureConceptTypeLabels.includes(singleSignatureLabel)) {
                    throw new Error('Could not create relation type with label: ' + newRelationTypeLabel
                        + '. Provided signature: ' + signatureConceptTypeLabels
                        + ' is not a specialization of any parent signature'
                        + '. Specifically concept type: ' + singleSignatureLabel
                        + '. It should be any of these: ' + possibleSignatureConceptTypeLabels)
                }
            })
        }
    }

    getRelationTypeById(idToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.id === idToFind);
        })
        return foundRelationType ? this._clone(foundRelationType) : foundRelationType;
    }

    getRelationTypeByLabel(labelOfRelationTypeToFind: string): RelationType {
        const foundRelationType: RelationType = this.relationTypes.find((singleRelationType) => {
            return (singleRelationType.label === labelOfRelationTypeToFind);
        })
        return foundRelationType ? this._clone(foundRelationType) : foundRelationType;
    }

    getRootRelationTypes(): RelationType[] {
        return this.rootRelationTypeIds.map((singleRootRelationTypeId) => {
            return this.getRelationTypeById(singleRootRelationTypeId);
        })
    }

    getLabelAndAllSubLabelsOfRelation(labelOrLabels: string | string[]): string[] {        
        if (typeof labelOrLabels === 'string') {
            return this._getLabelAndAllSubLabelsOfRelation(labelOrLabels, []);
        } else {
            return labelOrLabels?.reduce((accumulator, singleLabel) => {
                accumulator.push(...this._getLabelAndAllSubLabelsOfRelation(singleLabel, []));
                return accumulator;
            }, [])
        }
    }

    private _getLabelAndAllSubLabelsOfRelation(label: string, labelsGottenSoFar: string[]): string[] {
        if (!labelsGottenSoFar.includes(label)) {
            const toReturn = [label, ...labelsGottenSoFar];
            const relationType: RelationType = this.getRelationTypeByLabel(label);
            relationType?.subRelationTypeLabels?.forEach((singleSubRelationTypeLabel) => {
                toReturn.push(...this._getLabelAndAllSubLabelsOfRelation(singleSubRelationTypeLabel, labelsGottenSoFar));
            })
            return toReturn;
        } else {
            return [];
        }
    }

    updateRelationType(relationTypeToUpdate: RelationType): RelationType {
        this._validateRelationTypeToUpdate(relationTypeToUpdate);

        const oldRelationType: RelationType = this.getRelationTypeById(relationTypeToUpdate.id);

        // Update Labels of the item, parent references, and sub references
        this.relationTypes.forEach((singleRelationType: RelationType) => {
            if (singleRelationType.id === relationTypeToUpdate.id) {
                singleRelationType.label = relationTypeToUpdate.label;
            }
            const indexOfOldLabelInParents: number = singleRelationType.parentRelationTypeLabels.indexOf(oldRelationType.label);
            if (indexOfOldLabelInParents !== -1) {
                singleRelationType.parentRelationTypeLabels[indexOfOldLabelInParents] = relationTypeToUpdate.label;
            }
            const indexOfOldLabelInSubs: number = singleRelationType.subRelationTypeLabels.indexOf(oldRelationType.label);
            if (indexOfOldLabelInSubs !== -1) {
                singleRelationType.subRelationTypeLabels[indexOfOldLabelInSubs] = relationTypeToUpdate.label;
            }
        })

        // Update structure: Parent structure
        this.relationTypes.forEach((singleRelationType: RelationType) => {
            if (relationTypeToUpdate.parentRelationTypeLabels.includes(singleRelationType.label)) {
                if (!singleRelationType.subRelationTypeLabels.includes(relationTypeToUpdate.label)) {
                    singleRelationType.subRelationTypeLabels.push(relationTypeToUpdate.label);
                }
            }
            if (relationTypeToUpdate.id === singleRelationType.id) {
                singleRelationType.parentRelationTypeLabels = relationTypeToUpdate.parentRelationTypeLabels;
            }
        })

        // Update structure: Child structure
        this.relationTypes.forEach((singleRelationType: RelationType) => {
            if (relationTypeToUpdate.subRelationTypeLabels.includes(singleRelationType.label)) {
                if (!singleRelationType.parentRelationTypeLabels.includes(relationTypeToUpdate.label)) {
                    singleRelationType.parentRelationTypeLabels.push(relationTypeToUpdate.label);
                }
                if (singleRelationType.parentRelationTypeLabels.length > 0) {
                    // Remove from root if sub relation type has parents
                    this.rootRelationTypeIds = this.rootRelationTypeIds.filter((singleRootRelationType) => {
                        return (singleRootRelationType !== singleRelationType.id);
                    })
                }
            }
            if (relationTypeToUpdate.id === singleRelationType.id) {
                singleRelationType.subRelationTypeLabels = relationTypeToUpdate.subRelationTypeLabels;
            }
            // If removed child
            if (singleRelationType.parentRelationTypeLabels.includes(relationTypeToUpdate.label)
                && !relationTypeToUpdate.subRelationTypeLabels.includes(singleRelationType.label)) {
                if (!this.rootRelationTypeIds.includes(singleRelationType.id)) {
                    // Add to root if sub relation type has no parents
                    this.rootRelationTypeIds.push(singleRelationType.id);
                }
            }
        })

        if (relationTypeToUpdate.parentRelationTypeLabels.length > 0) {
            // Remove from root if relation type to update has parents
            this.rootRelationTypeIds = this.rootRelationTypeIds.filter((singleRootRelationType) => {
                return (singleRootRelationType !== relationTypeToUpdate.id);
            })

        } else if (!this.rootRelationTypeIds.includes(relationTypeToUpdate.id)) {
            // Add to root if relation type to update has no parents
            this.rootRelationTypeIds.push(relationTypeToUpdate.id);
        }


        return this.getRelationTypeByLabel(relationTypeToUpdate.label);
    }

    _validateRelationTypeToUpdate(relationTypeToUpdate: RelationType): void {
        // Cannot update relation if there is no id
        if (!relationTypeToUpdate.id) {
            throw new Error(`Could not update relation type with label: ${relationTypeToUpdate.label}. Id is ${relationTypeToUpdate.id}.`);
        }

        // Cannot update a relation label to an existing label
        const existingRelationType: RelationType = this.getRelationTypeByLabel(relationTypeToUpdate.label);
        if (existingRelationType && existingRelationType.id !== relationTypeToUpdate.id) {
            throw new Error(`Could not update relation type with label: ${relationTypeToUpdate.label}. Id is ${relationTypeToUpdate.id}. A relation type with that label already exists with id ${existingRelationType.id}`);
        }

        // Cannot relate to itself
        if (relationTypeToUpdate.subRelationTypeLabels.includes(relationTypeToUpdate.label)) {
            throw new Error(`Could not update relation type with label: ${relationTypeToUpdate.label}. One of the sub relation types is listed as itself`);
        }
        if (relationTypeToUpdate.parentRelationTypeLabels.includes(relationTypeToUpdate.label)) {
            throw new Error(`Could not update relation type with label: ${relationTypeToUpdate.label}. One of the parent relation types is listed as itself`);
        }

        // Referenced relation types must exist
        relationTypeToUpdate.parentRelationTypeLabels.forEach((singleParentRelationTypeLabel: string) => {
            const parentRelationType: RelationType = this.getRelationTypeByLabel(singleParentRelationTypeLabel);
            if (!parentRelationType) {
                throw new NoSuchRelationTypeError(`Could not update relation type with label: ${relationTypeToUpdate.label}. No such parent relation type: ${singleParentRelationTypeLabel}`);
            }
        })
        relationTypeToUpdate.subRelationTypeLabels.forEach((singleSubRelationTypeLabel: string) => {
            const parentRelationType: RelationType = this.getRelationTypeByLabel(singleSubRelationTypeLabel);
            if (!parentRelationType) {
                throw new NoSuchRelationTypeError(`Could not update relation type with label: ${relationTypeToUpdate.label}. No such sub relation type: ${singleSubRelationTypeLabel}`);
            }
        })
    }

    deleteRelationType(relationTypeIdToDelete: string): boolean {
        let successfulDelete: boolean = false;
        const relationTypeCountBefore: number = this.relationTypes.length;
        const relationTypeToDelete: RelationType = this.getRelationTypeById(relationTypeIdToDelete);
        if (!relationTypeToDelete) {
            return false;
        }
        Store.getInstance().state.relationTypes = this.relationTypes.filter((singleRelationType: RelationType) => {
            return (singleRelationType.id !== relationTypeIdToDelete);
        })
        this.relationTypes = Store.getInstance().state.relationTypes;
        this.rootRelationTypeIds.filter((singleRelationTypeId: string) => {
            return (singleRelationTypeId !== relationTypeIdToDelete);
        })
        this.relationTypes.forEach((singleRelationType: RelationType) => {
            if (singleRelationType.subRelationTypeLabels.includes(relationTypeToDelete.label)) {
                singleRelationType.subRelationTypeLabels = singleRelationType.subRelationTypeLabels.filter((singleSubRelationTypeLabel) => {
                    return (singleSubRelationTypeLabel !== relationTypeToDelete.label);
                })
            }
            if (singleRelationType.parentRelationTypeLabels.includes(relationTypeToDelete.label)) {
                singleRelationType.parentRelationTypeLabels = singleRelationType.parentRelationTypeLabels.filter((singleParentRelationTypeLabel) => {
                    return (singleParentRelationTypeLabel !== relationTypeToDelete.label);
                })
                if (singleRelationType.parentRelationTypeLabels.length === 0) {
                    if (!this.rootRelationTypeIds.includes(singleRelationType.id)) {
                        this.rootRelationTypeIds.push(singleRelationType.id);
                    }
                }
            }
        })
        if (this.relationTypes.length === (relationTypeCountBefore - 1)) {
            successfulDelete = true;
        }
        return successfulDelete;
    }

    importHierarchyFromSimpleRelationTypes(hierarchyToGenerate: SimpleRelationType[]): void {
        hierarchyToGenerate.forEach((singleNewRelationType) => {
            // Insert current root node
            const rootRelationType: RelationType = this.createRelationType(singleNewRelationType.label, singleNewRelationType.signature);

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
                    for (let i = 0; i < this.relationTypes.length; i++) {
                        const element = this.relationTypes[i];
                        if (element.id === parentRelationType.id) {
                            element.subRelationTypeLabels.push(existingRelationType.label);
                        }
                        if (element.id === existingRelationType.id) {
                            element.parentRelationTypeLabels.push(parentRelationType.label);
                        }
                    }
                    this.recursiveInsertSimpleRelationTypes(existingRelationType, singleNewSimpleRelationType.subRelationTypes);
                } else {
                    // Insert current node
                    const newRelationType: RelationType = this.createRelationType(singleNewSimpleRelationType.label,
                        singleNewSimpleRelationType.signature, [parentRelationType.label]);

                    // Insert child nodes recursively
                    this.recursiveInsertSimpleRelationTypes(newRelationType, singleNewSimpleRelationType.subRelationTypes);
                }
            })
        }
    }

    _clone(relationTypeToClone: RelationType): RelationType {
        return {
            ...relationTypeToClone,
            parentRelationTypeLabels: [...relationTypeToClone.parentRelationTypeLabels],
            subRelationTypeLabels: [...relationTypeToClone.subRelationTypeLabels]
        }
    }


}