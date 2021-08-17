import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao"
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao"
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao"
import { InMemoryConceptualGraphDao } from "../../main/dao/inmemory/InMemoryConceptualGraphDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
import { Concept, DesignatorType, QuantifierType } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";
import { QueryManager } from "../../main/query/QueryManager";
import { IdGenerator } from "../../main/util/IdGenerator";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: ConceptualGraphDao = new InMemoryConceptualGraphDao(conceptDao, relationDao);

const queryManager: QueryManager = new QueryManager(conceptDao, conceptTypeDao, relationDao, relationTypeDao);

// Some criteria to test:
//  1. Exact Concept Types | Parent Concept Types
//  2. Exact Relation Types | Parent Relation Types
//  3. Match all nodes | Extract only answer nodes
//  4. Single Answer | Multiple Answers

describe('Query manager: Single Lambda Queries', () => {

    beforeAll(() => {
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity"
        }];
        conceptTypeDao.importHierarchyFromSimpleConceptTypes(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "LinkTwo",
            signature: ["Entity", "Entity"]
        }];
        relationTypeDao.importHierarchyFromSimpleRelationTypes(relationTypeHierarchy);
    })

    it('Simple Query with one relation and two concepts: Exact Concept Types | Exact Relation Types | Match all nodes | Single Answer', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();

        // Create Conceptual graph: Flynt the bird is yellow
        createConcept_flyntTheBirdIsColourYellow(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsFlyntQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const flyntInQuery: Concept = whatColourIsFlyntQuery.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlyntQuery.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flyntInQuery, whatColour]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(answers.length).toBe(1);

        // Expect answer to be: Yellow
        const answerYellowSavedConcept: Concept = conceptDao.getConceptByLabel(yellowConceptLabel);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toEqual(answerYellowSavedConcept);
        const flyntSavedConcept: Concept = conceptDao.getConceptByLabel(flyntConceptLabel);
        expect(answers[0].getConceptByLabel(flyntConceptLabel)).toEqual(flyntSavedConcept);
        const flyntAttrYellowSavedRelation: Relation = relationDao.getRelationByLabel(flyntAttrYellowRelationLabel);
        expect(answers[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual(flyntAttrYellowSavedRelation);
    })

    it('Query with two relations and three concepts: Exact Concept Types | Exact Relation Types | Match all nodes | Multiple Answers', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();

        // Create Conceptual graph: Flynt the bird is yellow and blue
        createConcept_flyntTheBirdIsColourYellowAndBlue(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsFlyntQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const flyntInQuery: Concept = whatColourIsFlyntQuery.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlyntQuery.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flyntInQuery, whatColour]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(answers.length).toBe(2);

        // Expect First answer to be: Yellow
        const answerYellowSavedConcept: Concept = conceptDao.getConceptByLabel(yellowConceptLabel);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toEqual(answerYellowSavedConcept);
        const flyntSavedConcept: Concept = conceptDao.getConceptByLabel(flyntConceptLabel);
        expect(answers[0].getConceptByLabel(flyntConceptLabel)).toEqual(flyntSavedConcept);
        const flyntAttrYellowSavedRelation: Relation = relationDao.getRelationByLabel(flyntAttrYellowRelationLabel);
        expect(answers[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual(flyntAttrYellowSavedRelation);

        // Expect Second answer to be: Blue
        const answerBlueSavedConcept: Concept = conceptDao.getConceptByLabel(blueConceptLabel);
        expect(answers[1].getConceptByLabel(blueConceptLabel)).toEqual(answerBlueSavedConcept);
        expect(answers[1].getConceptByLabel(flyntConceptLabel)).toEqual(flyntSavedConcept);
        const flyntAttrBlueSavedRelation: Relation = relationDao.getRelationByLabel(flyntAttrBlueRelationLabel);
        expect(answers[1].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual(flyntAttrBlueSavedRelation);
    })

    it('Project answer nodes without returning whole: Exact Concept Types | Exact Relation Types | Extract only answer nodes | Single Answer', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();

        // Create Conceptual graph: Flynt the bird is yellow and blue
        createConcept_flyntTheBirdIsColourYellowAndBlue(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatBlueColour: Concept = whatColourIsFlyntQuery.createConcept("WhatColour", colourConceptTypeLabel, blueConceptLabel);
        const flyntInQuery: Concept = whatColourIsFlyntQuery.createConcept(flyntConceptLabel, birdConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        });
        whatColourIsFlyntQuery.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flyntInQuery, whatBlueColour]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(answers.length).toBe(1);

        // Expect First answer to be: Blue
        const answerBlueSavedConcept: Concept = conceptDao.getConceptByLabel(blueConceptLabel);
        expect(answers[0].getConceptByLabel(blueConceptLabel)).toEqual(answerBlueSavedConcept);
        const flyntSavedConcept: Concept = conceptDao.getConceptByLabel(flyntConceptLabel);
        expect(answers[0].getConceptByLabel(flyntConceptLabel)).toEqual(flyntSavedConcept);
        const flyntAttrYellowSavedRelation: Relation = relationDao.getRelationByLabel(flyntAttrBlueRelationLabel);
        expect(answers[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual(flyntAttrYellowSavedRelation);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toBeUndefined();
    })

    it('Match Sub Concepts Types: Exact Concept Types | Exact Relation Types | Match all nodes | Multiple Answers', () => {
        const testId: string = IdGenerator.getInstance().getNextUniquTestId();

        // Create Conceptual graph: Flynt the bird is yellow and blue
        createConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;

        // Create Query: What colour is the bird Flynt?
        const whatAnimalIsYellow: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsYellow.createConcept("WhatAnimal", animalConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsYellow.createConcept(blueConceptLabel, shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [shadeOfLightInQuery, whatAnimal]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsYellow);

        // Expect single answer
        expect(answers.length).toBe(1);

        // Expect Second answer to be: Blue
        const answerBlueSavedConcept: Concept = conceptDao.getConceptByLabel(blueConceptLabel);
        expect(answers[0].getConceptByLabel(blueConceptLabel)).toEqual(answerBlueSavedConcept);
        const flyntSavedConcept: Concept = conceptDao.getConceptByLabel(flyntConceptLabel);
        expect(answers[0].getConceptByLabel(flyntConceptLabel)).toEqual(flyntSavedConcept);
        const flyntAttrBlueSavedRelation: Relation = relationDao.getRelationByLabel(flyntAttrBlueRelationLabel);
        expect(answers[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual(flyntAttrBlueSavedRelation);
    })

})

function createConcept_flyntTheBirdIsColourYellow(testId: string) {
    const flyntTheBirdIsYellow: ConceptualGraph = new ConceptualGraph();

    const birdConceptTypeLabel: string = "Bird-" + testId;
    conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity"]);
    const colourConceptTypeLabel: string = "Colour-" + testId;
    conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity"]);
    const attributeRelationTypeLabel: string = "Attribute-" + testId;
    const attributeRelationType: RelationType
        = relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

    const flyntConceptLabel: string = "Flynt-" + testId;
    const flynt: Concept = flyntTheBirdIsYellow.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
    const yellowConceptLabel: string = "Yellow-" + testId;
    const yellow: Concept = flyntTheBirdIsYellow.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
    const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
    const flyntAttrYellowRelation: Relation
        = flyntTheBirdIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);

    conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellow);
}

function createConcept_flyntTheBirdIsColourYellowAndBlue(testId: string) {
    const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

    const birdConceptTypeLabel: string = "Bird-" + testId;
    conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity"]);
    const colourConceptTypeLabel: string = "Colour-" + testId;
    conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity"]);
    const attributeRelationTypeLabel: string = "Attribute-" + testId;
    const attributeRelationType: RelationType
        = relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

    const flyntConceptLabel: string = "Flynt-" + testId;
    const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
    const yellowConceptLabel: string = "Yellow-" + testId;
    const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
    const blueConceptLabel: string = "Blue-" + testId;
    const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
    const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
    const flyntAttrYellowRelation: Relation
        = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
    const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
    const flyntAttrBlueRelation: Relation
        = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

    conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
}

function createConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId: string) {
    const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

    const animalConceptTypeLabel: string = "Animal-" + testId;
    conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity"]);
    const birdConceptTypeLabel: string = "Bird-" + testId;
    conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

    const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
    conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity"]);
    const colourConceptTypeLabel: string = "Colour-" + testId;
    conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
    const attributeRelationTypeLabel: string = "Attribute-" + testId;
    const attributeRelationType: RelationType
        = relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

    const flyntConceptLabel: string = "Flynt-" + testId;
    const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
    const yellowConceptLabel: string = "Yellow-" + testId;
    const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
    const blueConceptLabel: string = "Blue-" + testId;
    const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
    const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
    const flyntAttrYellowRelation: Relation
        = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
    const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
    const flyntAttrBlueRelation: Relation
        = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

    conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
}