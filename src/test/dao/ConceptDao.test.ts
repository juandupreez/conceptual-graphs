import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { Concept } from "../../main/domain/Concept"
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const conceptDao: ConceptDao = new InMemoryConceptDao(new InMemoryConceptTypeDao);

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
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        const concept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);
        expect(concept.id).not.toBeNull();
        expect(concept).toEqual({
            id: concept.id,
            label: conceptLabel,
            conceptTypeLabels: [entityConceptTypeLabel],
            referent: textReferent
        });
    })

    it('Error: Create Concept with non-existent concept type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        expect(() => conceptDao.createConcept(conceptLabel, [nonExistentConceptTypeLabel], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". Concept Type '"
                + nonExistentConceptTypeLabel + "' does not exist");
    })

    it('Error: Create Concept must have a concept type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';

        expect(() => conceptDao.createConcept(conceptLabel, [], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". Needs at least one concept type");
    })

    it('Error: Create Concept with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const concept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);

        expect(() => conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent))
            .toThrow('Cannot create concept type with label: ' + conceptLabel + ". A concept with that label already exists");
    })

    it('Get concept by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);

        const conceptIdToFind: string = createdConcept.id;
        const savedConcept: Concept = conceptDao.getConceptById(conceptIdToFind);
        expect(createdConcept).toEqual(savedConcept);
    })

    it('Get concept by conceptual graph id and label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);

        const savedConcept: Concept = conceptDao.getConceptByLabel(conceptLabel);
        expect(createdConcept).toEqual(savedConcept);
    })

    it('Update concept referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const oldTextReferent: string = 'OldTextReferent';
        const newTextReferent: string = 'NewTextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], oldTextReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: createdConcept.id,
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            referent: newTextReferent
        }

        const updatedConcept: Concept = conceptDao.updateConcept(conceptToUpdate);

        const savedConcept: Concept = conceptDao.getConceptByLabel(conceptLabel);
        expect(createdConcept).not.toEqual(updatedConcept);
        expect(conceptToUpdate).toEqual(updatedConcept);
        expect(savedConcept).toEqual(updatedConcept);
    })

    it('Update concept label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const oldConceptLabel: string = conceptLabelPrefix1 + testId + "-old";
        const newConceptLabel: string = conceptLabelPrefix1 + testId + "-new";
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(oldConceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: createdConcept.id,
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            label: newConceptLabel
        }

        const updatedConcept: Concept = conceptDao.updateConcept(conceptToUpdate);

        const savedConcept: Concept = conceptDao.getConceptByLabel(newConceptLabel);
        expect(createdConcept).not.toEqual(updatedConcept);
        expect(conceptToUpdate).toEqual(updatedConcept);
        expect(savedConcept).toEqual(updatedConcept);
    })

    it('Error: Update Concept with non-existent concept type should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: createdConcept.id,
            conceptTypeLabels: [nonExistentConceptTypeLabel]
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label + '. No concept type label: '
                + nonExistentConceptTypeLabel);
    })

    it('Error: Update Concept must have a concept type', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const conceptLabel: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(conceptLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: createdConcept.id,
            conceptTypeLabels: []
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label
                + '. A concept must have at least one concept type');
    })

    it('Error: Update Concept with existing label for that conceptual graph should throw error', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const existingLabel: string = conceptLabelPrefix1 + testId;
        const newLabel: string = conceptLabelPrefix2 + testId;
        const textReferent: string = 'TextReferent';
        const existingConcept: Concept = conceptDao.createConcept(existingLabel, [entityConceptTypeLabel], textReferent);
        const createdConcept: Concept = conceptDao.createConcept(newLabel, [entityConceptTypeLabel], textReferent);
        const conceptToUpdate: Concept = {
            ...createdConcept,
            id: createdConcept.id,
            conceptTypeLabels: [...createdConcept.conceptTypeLabels],
            label: existingLabel
        }

        expect(() => conceptDao.updateConcept(conceptToUpdate))
            .toThrow('Could not update concept with label: '
                + conceptToUpdate.label
                + '. Another concept with that label already exists for this conceptual graph. It has id: '
                + existingConcept.id);
    })

    it('Delete concept', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const label: string = conceptLabelPrefix1 + testId;
        const textReferent: string = 'TextReferent';
        const createdConcept: Concept = conceptDao.createConcept(label, [entityConceptTypeLabel], textReferent);

        const isSuccessfulDelete: boolean = conceptDao.deleteConcept(createdConcept.id);
        
        expect(isSuccessfulDelete).toBe(true);
        const deletedConcept: Concept = conceptDao.getConceptByLabel(label);
        expect(deletedConcept).toBeUndefined();
    })

    it('Delete nonexistent concept should return false', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const label: string = conceptLabelPrefix1 + testId;
        const idToDelete: string = IdGenerator.getInstance().getNextUniqueConceptId()

        const isSuccessfulDelete: boolean = conceptDao.deleteConcept(idToDelete);
        
        expect(isSuccessfulDelete).toBe(false);
        const deletedConcept: Concept = conceptDao.getConceptByLabel(label);
        expect(deletedConcept).toBeUndefined();
    })

})