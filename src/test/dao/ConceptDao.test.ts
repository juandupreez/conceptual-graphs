import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { Concept, ConceptId } from "../../main/domain/Concept"
import { ConceptType } from "../../main/domain/ConceptType";
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const conceptDao: ConceptDao = new InMemoryConceptDao(new InMemoryConceptTypeDao);

const rootConceptTypeLabelPrefix1: string = 'TestRootConcept1-';
const testRootConceptTypeLabelPrefix2: string = 'TestRootConcept2-';
const testRootConceptTypeLabelPrefix3: string = 'TestRootConcept3-';
const testSubConceptTypeLabelPrefix1: string = 'TestSubConcept1-';
const testSubConceptTypeLabelPrefix2: string = 'TestSubConcept2-';
const testSubSubConceptTypeLabelPrefix1: string = 'TestSubSubConcept1-';
const testSubSubConceptTypeLabelPrefix2: string = 'TestSubSubConcept2-';
const entityConceptTypeLabel: string = 'Entity';
const subEntityConceptTypeLabel: string = 'SubEntity';
const subSubEntityConceptTypeLabel: string = 'SubSubEntity';
const nonExistentConceptTypeLabel: string = 'NonExistentEntity';
const conceptLabelPrefix1: string = 'Concept1-';
const conceptLabelPrefix2: string = 'Concept2-';

describe('ConceptDao basic tests', () => {

    beforeAll(() => {
        conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: entityConceptTypeLabel,
            subConceptTypes: [{
                label: subEntityConceptTypeLabel,
                subConceptTypes: [{
                    label: subSubEntityConceptTypeLabel
                }]
            }]
        }]);
    })

    it('create a concept with text referet', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        const concept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);
        expect(concept.id).not.toBeNull();
        concept.id.conceptualGraphId
        expect(concept).toEqual({
            id: {
                conceptId: concept.id.conceptId,
                conceptualGraphId: conceptualGraphId
            },
            label: conceptLabel,
            conceptTypeLabels: [entityConceptTypeLabel],
            referent: textReferent
        });
    })

    it('Error: Create Concept with non-existent concept type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        expect(() => conceptDao.createConcept(conceptualGraphId, conceptLabel, [nonExistentConceptTypeLabel], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". Concept Type '"
                + nonExistentConceptTypeLabel + "' does not exist");
    })

    it('Error: Create Concept must have a concept type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        expect(() => conceptDao.createConcept(conceptualGraphId, conceptLabel, [], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". Needs at least one concept type");
    })

    it('Error: Create Concept must have a conceptual graph id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        expect(() => conceptDao.createConcept(null, conceptLabel, [entityConceptTypeLabel], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". A conceptual graph must exist and id must be provided");
    })

    it('Error: Create Concept with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const concept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);

        expect(() => conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". A concept with that label already exists for conceptual graph with id: " + conceptualGraphId);
    })

    it('Get concept by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);

        const conceptIdToFind: ConceptId = {
            conceptId: createdConcept.id.conceptId,
            conceptualGraphId: conceptualGraphId
        }
        const savedConcept: Concept = conceptDao.getConceptById(conceptIdToFind);
        expect(createdConcept).toEqual(savedConcept);
    })

    it('Get concept by conceptual graph id and label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);

        const savedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, conceptLabel);
        expect(createdConcept).toEqual(savedConcept);
    })

    it('Update concept referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const oldTextReferent: string = 'OldTextReferent';
        const newTextReferent: string = 'NewTextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], oldTextReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id
            },
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            referent: newTextReferent
        }

        const updatedConcept: Concept = conceptDao.updateConcept(conceptToUpdate);

        const savedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, conceptLabel);
        expect(createdConcept).not.toEqual(updatedConcept);
        expect(conceptToUpdate).toEqual(updatedConcept);
        expect(savedConcept).toEqual(updatedConcept);
    })

    it('Update concept label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const oldConceptLabel: string = conceptLabelPrefix1 + testId + "-old";
        const newConceptLabel: string = conceptLabelPrefix1 + testId + "-new";
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, oldConceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id
            },
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            label: newConceptLabel
        }

        const updatedConcept: Concept = conceptDao.updateConcept(conceptToUpdate);

        const savedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, newConceptLabel);
        expect(createdConcept).not.toEqual(updatedConcept);
        expect(conceptToUpdate).toEqual(updatedConcept);
        expect(savedConcept).toEqual(updatedConcept);
    })

    it('Update concept conceptual graph', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const oldConceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const newConceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(oldConceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id,
                conceptualGraphId: newConceptualGraphId
            },
            conceptTypeLabels: [...createdConcept.conceptTypeLabels]
        }

        const updatedConcept: Concept = conceptDao.updateConcept(conceptToUpdate);

        const savedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(newConceptualGraphId, conceptLabel);
        expect(createdConcept).not.toEqual(updatedConcept);
        expect(conceptToUpdate).toEqual(updatedConcept);
        expect(savedConcept).toEqual(updatedConcept);
    })

    it('Error: Update Concept with non-existent concept type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id,
            },
            conceptTypeLabels: [nonExistentConceptTypeLabel]
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label + '. No concept type label: '
                + nonExistentConceptTypeLabel);
    })

    it('Error: Update Concept must have a concept type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id,
            },
            conceptTypeLabels: []
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label
                + '. A concept must have at least one concept type');
    })

    it('Error: Update Concept must have a conceptual graph id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id,
                conceptualGraphId: null
            },
            conceptTypeLabels: [...createdConcept.conceptTypeLabels]
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label
                + '. A concept must have conceptual graph id');
    })

    it('Error: Update Concept with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const existingLabel: string = conceptLabelPrefix1 + testId;
        const newLabel: string = conceptLabelPrefix2 + testId;
        const textReferent: string = 'TextReferent';
        const existingConcept: Concept = conceptDao.createConcept(conceptualGraphId, existingLabel, [entityConceptTypeLabel], textReferent);
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, newLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: {
                ...createdConcept.id
            },
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            label: existingLabel
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label
                + '. Another concept with that label already exists for this conceptual graph. It has id: '
                + existingConcept.id.conceptId);
    })

    it('Delete concept', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const label: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptualGraphId, label, [entityConceptTypeLabel], textReferent);

        const isSuccessfulDelete: boolean = conceptDao.deleteConcept(createdConcept.id);
        
        expect(isSuccessfulDelete).toBe(true);
        const deletedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, label);
        expect(deletedConcept).toBeUndefined();
    })

    it('Delete nonexistent concept should return false', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptualGraphId: string = IdGenerator.getInstance().getNextUniqueConceptualGraphId();
        const label: string = conceptLabelPrefix1 + testId;
        const idToDelete: ConceptId = {
            conceptId: IdGenerator.getInstance().getNextUniqueConceptId(),
            conceptualGraphId: conceptualGraphId
        }

        const isSuccessfulDelete: boolean = conceptDao.deleteConcept(idToDelete);
        
        expect(isSuccessfulDelete).toBe(false);
        const deletedConcept: Concept = conceptDao.getConceptByConceptualGraphIdAndLabel(conceptualGraphId, label);
        expect(deletedConcept).toBeUndefined();
    })

})