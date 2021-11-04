import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { ConceptualGraph, ConceptualGraphSkeleton } from "../../main/domain/ConceptualGraph";
import { Concept, DesignatorType } from "../../main/domain/Concept";
import { Relation } from "../../main/domain/Relation";
import { IdGenerator } from "../../main/util/IdGenerator";
import { SimpleRelationType } from "../../main/domain/RelationType";
import { SimpleConceptType } from "../../main/domain/ConceptType";
import { FactDao, InMemoryFactDao } from "../../main/conceptual-graphs";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const factDao: FactDao = new InMemoryFactDao(conceptDao, relationDao);

describe('FactDao basic CRUD', () => {

    beforeAll(() => {
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity",
            subConceptTypes: [
                { label: "Cat" },
                { label: "Mat" }
            ]
        }]
        conceptTypeDao.importHierarchyFromSimpleConceptTypes(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "Link",
            signature: ["Entity", "Entity"],
            subRelationTypes: [{
                label: "On",
                signature: ["Cat", "Mat"]
            }]
        }]
        relationTypeDao.importHierarchyFromSimpleRelationTypes(relationTypeHierarchy);
    })

    it('Create simple conceptual graph: The cat is on the mat', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel: string = "TheCat-" + testId;
        const matConceptLabel: string = "TheMat-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "The cat is on the mat - " + testId;
        const catConcept: Concept = conceptualGraph.createConcept(catConceptLabel, "Cat", "The");
        const matConcept: Concept = conceptualGraph.createConcept(matConceptLabel, "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation(onRelationLabel, "On", [catConcept, matConcept]);

        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactById(createdConceptualGraph.id);
        expect(createdConceptualGraph).toEqual(savedConceptualGraph);
        const createdCatConcept: Concept = conceptDao.getConceptByLabel(catConceptLabel);
        expect(createdCatConcept).toEqual({
            ...catConcept,
            id: createdCatConcept.id
        });
        const createdMatConcept: Concept = conceptDao.getConceptByLabel(matConceptLabel);
        expect(createdMatConcept).toEqual({
            ...matConcept,
            id: createdMatConcept.id
        });
        const createdOnTheRelation: Relation = relationDao.getRelationByLabel(onRelationLabel);
        expect(createdOnTheRelation).toEqual({
            ...onRelation,
            id: createdOnTheRelation.id
        });
    })

    it('Create conceptual graph with concepts/relations that already exist', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel: string = "TheCat-" + testId;
        const matConceptLabel: string = "TheMat-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "The cat is on the mat - " + testId;
        const catConcept: Concept = conceptDao.createConcept(catConceptLabel, ["Cat"], "The");
        catConcept.referent = {
            designatorType: DesignatorType.THE,
            designatorValue: "THE"
        };
        conceptualGraph.addConcept(catConcept);
        const matConcept: Concept = conceptDao.createConcept(matConceptLabel, ["Mat"], "The");
        matConcept.referent = {
            designatorType: DesignatorType.THE,
            designatorValue: "THE"
        };
        conceptualGraph.addConcept(matConcept);
        const onRelation: Relation = relationDao.createRelation(onRelationLabel, ["On"], [catConceptLabel, matConceptLabel]);
        conceptualGraph.addRelation(onRelation);

        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactById(createdConceptualGraph.id);
        expect(createdConceptualGraph).toEqual(savedConceptualGraph);
        const savedCatConcept: Concept = conceptDao.getConceptByLabel(catConceptLabel);
        expect(savedCatConcept).toEqual(catConcept);
        const savedMatConcept: Concept = conceptDao.getConceptByLabel(matConceptLabel);
        expect(savedMatConcept).toEqual({
            ...matConcept
        });
        const savedOnTheRelation: Relation = relationDao.getRelationByLabel(onRelationLabel);
        expect(savedOnTheRelation).toEqual({
            ...onRelation
        });
    })

    it('Get conceptual graph by Id', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel: string = "TheCat-" + testId;
        const matConceptLabel: string = "TheMat-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "The cat is on the mat - " + testId;
        const catConcept: Concept = conceptualGraph.createConcept(catConceptLabel, "Cat", "The");
        const matConcept: Concept = conceptualGraph.createConcept(matConceptLabel, "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation(onRelationLabel, "On", [catConcept, matConcept]);

        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactById(createdConceptualGraph.id);
        expect(createdConceptualGraph).toEqual(savedConceptualGraph);
    })

    it('Get conceptual graph by Label', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel: string = "TheCat-" + testId;
        const matConceptLabel: string = "TheMat-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "The cat is on the mat - " + testId;
        const catConcept: Concept = conceptualGraph.createConcept(catConceptLabel, "Cat", "The");
        const matConcept: Concept = conceptualGraph.createConcept(matConceptLabel, "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation(onRelationLabel, "On", [catConcept, matConcept]);

        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactByLabel(createdConceptualGraph.label);
        expect(createdConceptualGraph).toEqual(savedConceptualGraph);
    })

    it('Update conceptual graph', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel1: string = "TheCat1-" + testId;
        const catConceptLabel2: string = "TheCat2-" + testId;
        const matConceptLabel1: string = "TheMat1-" + testId;
        const matConceptLabel2: string = "TheMat2-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "Old: the cat is on the mat - " + testId;
        const catConcept1: Concept = conceptualGraph.createConcept(catConceptLabel1, "Cat", "The");
        const matConcept1: Concept = conceptualGraph.createConcept(matConceptLabel1, "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation(onRelationLabel, "On", [catConcept1, matConcept1]);
        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        conceptualGraph.label = "New: the cat is on the mat - " + testId;
        const catConcept2: Concept = conceptDao.createConcept(catConceptLabel2, ["Cat"], "The");
        const matConcept2: Concept = conceptDao.createConcept(matConceptLabel2, ["Mat"], "The");
        onRelation.conceptArgumentLabels = [catConceptLabel2, matConceptLabel2];
        conceptualGraph.updateRelationByLabel(onRelation);
        conceptualGraph.removeConceptByLabel(catConceptLabel1);
        conceptualGraph.removeConceptByLabel(matConceptLabel1);

        const updatedConceptualGraph: ConceptualGraph = factDao.updateFact(conceptualGraph);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactById(updatedConceptualGraph.id);
        expect(createdConceptualGraph).not.toEqual(savedConceptualGraph);
        expect(updatedConceptualGraph).toEqual(savedConceptualGraph);
    })

    it('Delete conceptual graph', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        const catConceptLabel: string = "TheCat-" + testId;
        const matConceptLabel: string = "TheMat-" + testId;
        const onRelationLabel: string = "OnThe-" + testId;

        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        conceptualGraph.label = "The cat is on the mat - " + testId;
        const catConcept1: Concept = conceptualGraph.createConcept(catConceptLabel, "Cat", "The");
        const matConcept1: Concept = conceptualGraph.createConcept(matConceptLabel, "Mat", "The");
        const onRelation: Relation = conceptualGraph.createRelation(onRelationLabel, "On", [catConcept1, matConcept1]);
        const createdConceptualGraph: ConceptualGraph = factDao.createFact(conceptualGraph);

        const isSuccessfulDelete: boolean = factDao.deleteFact(conceptualGraph.id);

        expect(isSuccessfulDelete).toBe(true);
        const savedConceptualGraph: ConceptualGraph = factDao.getFactById(createdConceptualGraph.id);
        expect(savedConceptualGraph).toBeUndefined();
    })

})

describe('FactDao import facts', () => {

    it('should import a simple conceptual graph as a concept', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        conceptTypeDao.createConceptType("Number-" + testId);
        const factsToImport: ConceptualGraphSkeleton[] = [{
            label: "There exists a number " + testId,
            concepts: [{
                label: "Number-" + testId,
                conceptTypeLabels: ["Number-" + testId],
                referent: testId
            }]
        }];
        factDao.importFacts(factsToImport);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactByLabel("There exists a number " + testId);
        expect(savedConceptualGraph).not.toBeUndefined();
        expect(savedConceptualGraph.getConceptByLabel("Number-" + testId)).toEqual({
            id: savedConceptualGraph.getConceptByLabel("Number-" + testId)?.id,
            label: "Number-" + testId,
            conceptTypeLabels: ["Number-" + testId],
            referent: {
                designatorType: DesignatorType.LITERAL,
                designatorValue: testId
            }
        } as Concept);
    })

    it('should import a single concept when specifying a detailed referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        conceptTypeDao.createConceptType("Number-" + testId);
        const factsToImport: ConceptualGraphSkeleton[] = [{
            label: "There exists a number " + testId,
            concepts: [{
                label: "Number-" + testId,
                conceptTypeLabels: ["Number-" + testId],
                referent: {
                    designatorType: DesignatorType.BLANK
                }
            }]
        }];
        factDao.importFacts(factsToImport);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactByLabel("There exists a number " + testId);
        expect(savedConceptualGraph).not.toBeUndefined();
        expect(savedConceptualGraph.getConceptByLabel("Number-" + testId)).toEqual({
            id: savedConceptualGraph.getConceptByLabel("Number-" + testId)?.id,
            label: "Number-" + testId,
            conceptTypeLabels: ["Number-" + testId],
            referent: {
                designatorType: DesignatorType.BLANK,
            }
        } as Concept);
    })

    it('should import a single concept when specifying a LAMBDA referent', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();
        conceptTypeDao.createConceptType("Number-" + testId);
        const factsToImport: ConceptualGraphSkeleton[] = [{
            label: "There exists a number " + testId,
            concepts: [{
                label: "SomeNumber-" + testId,
                conceptTypeLabels: ["Number-" + testId],
                referent: "LAMBDA"
            }]
        }];
        factDao.importFacts(factsToImport);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactByLabel("There exists a number " + testId);
        expect(savedConceptualGraph).not.toBeUndefined();
        expect(savedConceptualGraph.getConceptByLabel("SomeNumber-" + testId)).toEqual({
            id: savedConceptualGraph.getConceptByLabel("SomeNumber-" + testId)?.id,
            label: "SomeNumber-" + testId,
            conceptTypeLabels: ["Number-" + testId],
            referent: {
                designatorType: DesignatorType.LAMBDA
            }
        } as Concept);
    })

    it('should import two concepts and a relation', () => {
        const testId1: string = IdGenerator.getInstance().getNextUniquTestId();
        const testId2: string = IdGenerator.getInstance().getNextUniquTestId();
        conceptTypeDao.createConceptType("Number-" + testId1);
        relationTypeDao.createRelationType("Plus", ["Number-" + testId1, "Number-" + testId1]);
        const factsToImport: ConceptualGraphSkeleton[] = [{
            label: "One Plus Two " + testId1,
            concepts: [{
                label: "Number-" + testId1,
                conceptTypeLabels: ["Number-" + testId1],
                referent: testId1
            }, {
                label: "Number-" + testId2,
                conceptTypeLabels: ["Number-" + testId1],
                referent: testId2
            }],
            relations: [{
                label: "one-plus-two-" + testId1,
                relationTypeLabels: ["Plus"],
                conceptArgumentLabels: ["Number-" + testId1, "Number-" + testId2]
            }]
        }];
        factDao.importFacts(factsToImport);

        const savedConceptualGraph: ConceptualGraph = factDao.getFactByLabel("One Plus Two " + testId1);
        expect(savedConceptualGraph).not.toBeUndefined();
        expect(savedConceptualGraph.getConceptByLabel("Number-" + testId1)).toEqual({
            id: savedConceptualGraph.getConceptByLabel("Number-" + testId1)?.id,
            label: "Number-" + testId1,
            conceptTypeLabels: ["Number-" + testId1],
            referent: {
                designatorType: DesignatorType.LITERAL,
                designatorValue: testId1
            }
        } as Concept);
        expect(savedConceptualGraph.getConceptByLabel("Number-" + testId2)).toEqual({
            id: savedConceptualGraph.getConceptByLabel("Number-" + testId2)?.id,
            label: "Number-" + testId2,
            conceptTypeLabels: ["Number-" + testId1],
            referent: {
                designatorType: DesignatorType.LITERAL,
                designatorValue: testId2
            }
        } as Concept);
        expect(savedConceptualGraph.getRelationByLabel("one-plus-two-" + testId1)).toEqual({
            id: savedConceptualGraph.getRelationByLabel("one-plus-two-" + testId1)?.id,
            label: "one-plus-two-" + testId1,
            relationTypeLabels: ["Plus"],
            conceptArgumentLabels: ["Number-" + testId1, "Number-" + testId2]
        } as Relation);
    })

})