import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
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

describe('FactDao', () => {

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