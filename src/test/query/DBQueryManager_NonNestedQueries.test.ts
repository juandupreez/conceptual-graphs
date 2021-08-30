import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao"
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao"
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao"
import { InMemoryConceptualGraphDao } from "../../main/dao/inmemory/InMemoryConceptualGraphDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept, DesignatorType, QuantifierType } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { DatabaseQueryManager } from "../../main/query/DatabaseQueryManager";
import { QueryManager } from "../../main/query/QueryManager";
import { IdGenerator } from "../../main/util/IdGenerator";
import { TestScenarioProvider_FlyntTheBird } from "../testutil/TestScenarioProvider_FlyntTheBird";
import { TestScenarioProvider_PhineasAndFerb } from "../testutil/TestScenarioProvider_PhineasAndFerb";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: ConceptualGraphDao = new InMemoryConceptualGraphDao(conceptDao, relationDao);
const testScenarioProvider_FlyntTheBird: TestScenarioProvider_FlyntTheBird = new TestScenarioProvider_FlyntTheBird(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);
const testScenarioProvider_PhineasAndFerb: TestScenarioProvider_PhineasAndFerb = new TestScenarioProvider_PhineasAndFerb(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);

const queryManager: QueryManager = new DatabaseQueryManager(conceptDao, relationDao);

let testId: string = "";

// Some criteria to test:
//  1. Exact Concept Types | Parent Concept Types
//  2. Exact Relation Types | Parent Relation Types
//  3. Match all nodes | Extract only answer nodes
//  4. Single Answer | Multiple Answers

describe('Simple queries', () => {

    beforeEach(() => {
        testId = IdGenerator.getInstance().getNextUniquTestId();
        global.console = require('console');
    })

    it('Simple Query with one relation and two concepts: Exact Concept Types | Exact Relation Types | Match all nodes | Single Answer', () => {

        // Create Conceptual graph: Flynt the bird is yellow
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellow(testId);
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
        // Create Conceptual graph: Flynt the bird is yellow and blue
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellowAndBlue(testId);
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
        // Create Conceptual graph: Flynt the bird is yellow and blue
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellowAndBlue(testId);
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

    it('Match Sub Concepts Types: Parent Concept Types | Exact Relation Types | Match all nodes | Single Answer', () => {
        // Create Conceptual graph: Flynt the bird is yellow and blue
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId);
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
        whatAnimalIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

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

    it('Match Sub Relation Types: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        // Create Conceptual graph: Flynt the bird is yellow and blue
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
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
        whatAnimalIsYellow.createRelation(flyntAttrYellowRelationLabel, propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

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

    it('Matching relations should match concepts exactly: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        // Create Conceptual graph: Flynt the bird is yellow and blue
        testScenarioProvider_FlyntTheBird.createConcept_flyntTheBirdIsColourYellowAndBlueWithReverseRelation(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const reverseAttributeRelationTypeLabel: string = "ReverseAttribute-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const blueAttrFlyntRelationLabel: string = "blue-attribute-flynt-reverse-" + testId;
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
        // whatAnimalIsYellow.createRelation(flyntAttrYellowRelationLabel, "LinkTwo", [shadeOfLightInQuery, whatAnimal]);
        whatAnimalIsYellow.createRelation(flyntAttrYellowRelationLabel, propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

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
        expect(answers[0].getRelationByLabel(blueAttrFlyntRelationLabel)).toBeUndefined();
    })

    it('Match 3 Lambdas: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        testScenarioProvider_FlyntTheBird.createConcept_threeAnimalsWithColourAndAllThreeCute(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const cuteConceptTypeLabel: string = "Cute-" + testId;

        const attributeRelationTypeLabel: string = "Attribute-" + testId;

        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const rhysandAttrBlueRelationLabel: string = "rhysand-attribute-blue-" + testId;
        const ruskyAttrRedRelationLabel: string = "rusky-attribute-red-" + testId;

        const flyntConceptLabel: string = "Flynt-" + testId;
        const rhysandConceptLabel: string = "Rhysand-" + testId;
        const ruskyConceptLabel: string = "Rusky-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        const redConceptLabel: string = "Red-" + testId;

        // Create Query: Which Animals have colour and are cute?
        const whichAnimalsHaveColourAndAreCute: ConceptualGraph = new ConceptualGraph();
        const whatAnimalInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("WhatAnimal", animalConceptTypeLabel, DesignatorType.LAMBDA)
        const colourInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        whichAnimalsHaveColourAndAreCute.createRelation("query-whatanimal-attr-whatcolour", attributeRelationTypeLabel, [whatAnimalInQuery, colourInQuery]);

        const cuteInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("AnyCute", cuteConceptTypeLabel, DesignatorType.LAMBDA);
        whichAnimalsHaveColourAndAreCute.createRelation("query-whatanimal-attr-cute", attributeRelationTypeLabel, [whatAnimalInQuery, cuteInQuery]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whichAnimalsHaveColourAndAreCute);

        // Expect single answer
        expect(answers.length).toBe(3);

        // Expect First answer to be: Flynt is yellow
        const flyntConceptInDB: Concept = conceptDao.getConceptByLabel(flyntConceptLabel);
        expect(answers[0].getConceptByLabel(flyntConceptLabel)).toEqual(flyntConceptInDB);
        const yellowConceptInDB: Concept = conceptDao.getConceptByLabel(yellowConceptLabel);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toEqual(yellowConceptInDB);
        const flyntAttrYellowRelationInDB: Relation = relationDao.getRelationByLabel(flyntAttrYellowRelationLabel);
        const flyntAttrYellowRelationInAnswer: Relation = answers[0].getRelationByLabel(flyntAttrYellowRelationLabel);
        expect(flyntAttrYellowRelationInAnswer).toEqual(flyntAttrYellowRelationInDB);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[0].getConceptByLabel(flyntConceptLabel).label);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[0].getConceptByLabel(yellowConceptLabel).label);

        // Expect Second answer to be: Rhysand is blue
        const rhysandConceptInDB: Concept = conceptDao.getConceptByLabel(rhysandConceptLabel);
        expect(answers[1].getConceptByLabel(rhysandConceptLabel)).toEqual(rhysandConceptInDB);
        const blueConceptInDB: Concept = conceptDao.getConceptByLabel(blueConceptLabel);
        expect(answers[1].getConceptByLabel(blueConceptLabel)).toEqual(blueConceptInDB);
        const rhysandAttrBlueRelationInDB: Relation = relationDao.getRelationByLabel(rhysandAttrBlueRelationLabel);
        const rhysandAttrBlueRelationInAnswer: Relation = answers[1].getRelationByLabel(rhysandAttrBlueRelationLabel);
        expect(rhysandAttrBlueRelationInAnswer).toEqual(rhysandAttrBlueRelationInDB);
        expect(rhysandAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[1].getConceptByLabel(rhysandConceptLabel).label);
        expect(rhysandAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[1].getConceptByLabel(blueConceptLabel).label);

        // Expect Second answer to be: Rusky is red
        const ruskyConceptInDB: Concept = conceptDao.getConceptByLabel(ruskyConceptLabel);
        expect(answers[2].getConceptByLabel(ruskyConceptLabel)).toEqual(ruskyConceptInDB);
        const redConceptInDB: Concept = conceptDao.getConceptByLabel(redConceptLabel);
        expect(answers[2].getConceptByLabel(redConceptLabel)).toEqual(redConceptInDB);
        const ruskyAttrBllueRelationInDB: Relation = relationDao.getRelationByLabel(ruskyAttrRedRelationLabel);
        const ruskyAttrBllueRelationInAnswer: Relation = answers[2].getRelationByLabel(ruskyAttrRedRelationLabel);
        expect(ruskyAttrBllueRelationInAnswer).toEqual(ruskyAttrBllueRelationInDB);
        expect(ruskyAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[2].getConceptByLabel(ruskyConceptLabel).label);
        expect(ruskyAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[2].getConceptByLabel(redConceptLabel).label);
    })

    it('Direct Cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        testScenarioProvider_FlyntTheBird.createConcept_yellowHasAttributeYellow(testId);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const yellowAttrYellowRelationLabel: string = "yellow-attribute-yellow-" + testId;

        // Create Query: What Colour is Yellow
        const whatColourIsYellow: ConceptualGraph = new ConceptualGraph();
        const yellowInQuery: Concept = whatColourIsYellow.createConcept("QueryYellow", colourConceptTypeLabel, yellowConceptLabel);
        const colourInQuery: Concept = whatColourIsYellow.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        whatColourIsYellow.createRelation("query-yellow-attr-whatcolour", attributeRelationTypeLabel, [yellowInQuery, colourInQuery]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatColourIsYellow);

        // Expect single answer
        expect(answers.length).toBe(1);

        // Expect First answer to be: Yellow is yellow
        const yellowConceptInDB: Concept = conceptDao.getConceptByLabel(yellowConceptLabel);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toEqual(yellowConceptInDB);
        const yellowAttrYellowRelationInDB: Relation = relationDao.getRelationByLabel(yellowAttrYellowRelationLabel);
        const yellowAttrYellowRelationInAnswer: Relation = answers[0].getRelationByLabel(yellowAttrYellowRelationLabel);
        expect(yellowAttrYellowRelationInAnswer).toEqual(yellowAttrYellowRelationInDB);
        expect(yellowAttrYellowRelationInAnswer.conceptArgumentLabels).toContainEqual(answers[0].getConceptByLabel(yellowConceptLabel).label);
    })

    it('Two level deep cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        testScenarioProvider_FlyntTheBird.createConcept_flyntHasAttributeYellowHasAttributeFlynt(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const yellowAttrFlyntRelationLabel: string = "yellow-attribute-flynt-" + testId;

        // Create Query: What Colour is the colour that flynt is
        const whatColourIsFlynt: ConceptualGraph = new ConceptualGraph();
        const colourInQuery: Concept = whatColourIsFlynt.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        const flyntInQuery: Concept = whatColourIsFlynt.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlynt.createRelation("query-flynt-attr-whatcolour", attributeRelationTypeLabel, [flyntInQuery, colourInQuery]);
        whatColourIsFlynt.createRelation("query-whatcolour-attr-flynt", attributeRelationTypeLabel, [colourInQuery, flyntInQuery]);

        // Run query against data
        const answers: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlynt);

        // Expect single answer
        expect(answers.length).toBe(1);

        // Expect First answer to be: Yellow is yellow
        expect(answers[0].concepts.length).toBe(2);
        const yellowConceptInDB: Concept = conceptDao.getConceptByLabel(yellowConceptLabel);
        expect(answers[0].getConceptByLabel(yellowConceptLabel)).toEqual(yellowConceptInDB);
        const flyntAttrYellowRelationInDB: Relation = relationDao.getRelationByLabel(flyntAttrYellowRelationLabel);
        const flyntAttrYellowRelationInAnswer: Relation = answers[0].getRelationByLabel(flyntAttrYellowRelationLabel);
        expect(flyntAttrYellowRelationInAnswer).toEqual(flyntAttrYellowRelationInDB);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels[0]).toEqual(answers[0].getConceptByLabel(flyntConceptLabel).label);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels[1]).toEqual(answers[0].getConceptByLabel(yellowConceptLabel).label);
        const yellowAttrFlyntRelationInDB: Relation = relationDao.getRelationByLabel(yellowAttrFlyntRelationLabel);
        const yellowAttrFlyntRelationInAnswer: Relation = answers[0].getRelationByLabel(yellowAttrFlyntRelationLabel);
        expect(yellowAttrFlyntRelationInDB).toEqual(yellowAttrFlyntRelationInAnswer);
        expect(yellowAttrFlyntRelationInAnswer.conceptArgumentLabels[0]).toEqual(answers[0].getConceptByLabel(yellowConceptLabel).label);
        expect(yellowAttrFlyntRelationInAnswer.conceptArgumentLabels[1]).toEqual(answers[0].getConceptByLabel(flyntConceptLabel).label);
    })

})

describe('A more complex scenario. Phineas and Ferb structure', () => {

    beforeAll(() => {
        testScenarioProvider_PhineasAndFerb.createPhineasAndFerbStructure();
    })

    beforeEach(() => {
        testId = IdGenerator.getInstance().getNextUniquTestId();
        global.console = require('console');
    })

    it('Who are the siblings of Phineas', () => {
        const whoAreSiblingsOfPhineas: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoAreSiblingsOfPhineas.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const phineas: Concept = whoAreSiblingsOfPhineas.createConcept("PhineasInQuery", "Human", "Phineas");
        whoAreSiblingsOfPhineas.createRelation("who-siblingOf-phineas", "SiblingOf", [who, phineas]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreSiblingsOfPhineas);

        // Expect answer to be Ferb and Candace
        expect(answers.length).toBe(2);
        expect(answers[0].concepts.length).toBe(2);
        expect(answers[0].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
        expect(answers[1].concepts.length).toBe(2);
        expect(answers[1].getConceptByLabel("Candace")).toEqual(testScenarioProvider_PhineasAndFerb.candace);
    })

    it('Who are the children of Lindana and Lawrence', () => {
        const whoAreChildrenOfLindanaAndLawrence: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const lindana: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("LindanaQuery", "Human", "Lindana");
        const lawrence: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("LawrenceQuery", "Human", "Lawrence");
        whoAreChildrenOfLindanaAndLawrence.createRelation("who-childOf-lindana", "ChildOf", [who, lindana]);
        whoAreChildrenOfLindanaAndLawrence.createRelation("who-childOf-lawrence", "ChildOf", [who, lawrence]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreChildrenOfLindanaAndLawrence);

        // Expect answer to be Phineas, Ferb and Candace
        expect(answers.length).toBe(3);
        expect(answers[0].concepts.length).toBe(3);
        expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(answers[1].concepts.length).toBe(3);
        expect(answers[1].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
        expect(answers[2].concepts.length).toBe(3);
        expect(answers[2].getConceptByLabel("Candace")).toEqual(testScenarioProvider_PhineasAndFerb.candace);
    })

    it('Who is the step son of Lawrence', () => {
        const whoIsTheStepsonOfLawrence: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoIsTheStepsonOfLawrence.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const lawrence: Concept = whoIsTheStepsonOfLawrence.createConcept("LawrenceQuery", "Human", "Lawrence");
        whoIsTheStepsonOfLawrence.createRelation("who-stepChildOf-lawrence", "StepSonOf", [who, lawrence]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsTheStepsonOfLawrence);

        // Expect answer to be Phineas
        expect(answers.length).toBe(1);
        expect(answers[0].concepts.length).toBe(2);
        expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
    })

    it('Who are the step siblings of Candace', () => {
        const whoAreStepSiblingsOfCandace: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoAreStepSiblingsOfCandace.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const candace: Concept = whoAreStepSiblingsOfCandace.createConcept("Candace", "Human", "Candace");
        whoAreStepSiblingsOfCandace.createRelation("who-stepSiblingOf-candace", "StepBrotherOf", [who, candace]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreStepSiblingsOfCandace);

        // Expect answer to be Ferb
        expect(answers.length).toBe(1);
        expect(answers[0].concepts.length).toBe(2);
        expect(answers[0].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
    })

    it('Who have a mom and a dad and a pet platypus and a friend named baljeet', () => {
        const whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const someMom: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomeMom", "Human", DesignatorType.LAMBDA);
        const someDad: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomeDad", "Human", DesignatorType.LAMBDA);
        const somePlatypus: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomePlatypus", "Platypus", DesignatorType.LAMBDA);
        const baljeet: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("BaljeetInQuery", "Boy", "Baljeet");
        whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("somemom-motherOf-who", "MotherOf", [someMom, who]);
        whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("somedad-fatherOf-who", "FatherOf", [someDad, who]);
        whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("who-ownsPet-platypus", "OwnsPet", [who, somePlatypus]);
        whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("who-friendOf-baljeet", "FriendOf", [who, baljeet]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet);

        // Expect answer to be Ferb and Phineas
        expect(answers.length).toBe(2);
        expect(answers[0].concepts.length).toBe(5);
        expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(answers[1].concepts.length).toBe(5);
        expect(answers[1].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
    })

    it('Which animals are pets to children who are friends with buford', () => {
        const whichAnimalIsPetToChildFriendOfBuford: ConceptualGraph = new ConceptualGraph();
        const whichAnimal: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("WhichAnimal", "Animal", DesignatorType.LAMBDA);
        const someChild: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("SomeChild", "Human", DesignatorType.LAMBDA);
        const buford: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("BufordInQuery", "Human", "Buford");
        whichAnimalIsPetToChildFriendOfBuford.createRelation("somechild-ownsPet-whichanimal", "OwnsPet", [someChild, whichAnimal]);
        whichAnimalIsPetToChildFriendOfBuford.createRelation("somechild-friendOf-buford", "FriendOf", [someChild, buford]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whichAnimalIsPetToChildFriendOfBuford);

        // Expect answer to be Perry and Pinky
        expect(answers.length).toBe(3);
        expect(answers[0].concepts.length).toBe(3);
        expect(answers[0].getConceptByLabel("PerryThePlatypus")).toEqual(testScenarioProvider_PhineasAndFerb.perryThePlatypus);
        expect(answers[1].concepts.length).toBe(3);
        expect(answers[1].getConceptByLabel("PerryThePlatypus")).toEqual(testScenarioProvider_PhineasAndFerb.perryThePlatypus);
        expect(answers[2].concepts.length).toBe(3);
        expect(answers[2].getConceptByLabel("PinkyTheChihuahua")).toEqual(testScenarioProvider_PhineasAndFerb.pinkyTheChihuahua);
    })

    it('Who is not nerdy', () => {
        const whoIsNotANerd: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoIsNotANerd.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const nerdy: Concept = whoIsNotANerd.createConcept("Nerdy", "Property", "Nerdy");
        whoIsNotANerd.createRelation("who-attr-nerdy", "Attribute", [who, nerdy]);
        whoIsNotANerd.createRelation("not-nerdy", "Not", [nerdy]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsNotANerd);

        // Expect answer to be Buford
        expect(answers.length).toBe(1);
        expect(answers[0].concepts.length).toBe(2);
        expect(answers[0].getConceptByLabel("Buford")).toEqual(testScenarioProvider_PhineasAndFerb.buford);
        expect(answers[0].getConceptByLabel("Nerdy")).toEqual(testScenarioProvider_PhineasAndFerb.nerdy);
        expect(answers[0].getRelationsWhereConceptIsUsed(answers[0].getConceptByLabel("Nerdy"))[0]).toEqual(relationDao.getRelationByLabel("not-nerdy"));
    })

    it('Who is between phineas and ferb', () => {
        const whoIsNotANerd: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoIsNotANerd.createConcept("Who", "Human", DesignatorType.LAMBDA);
        const phineas: Concept = whoIsNotANerd.createConcept("Phineas", "Human", "Phineas");
        const ferb: Concept = whoIsNotANerd.createConcept("Ferb", "Human", "Ferb");
        whoIsNotANerd.createRelation("who-between-phineas-and-ferb", "Between", [who, phineas, ferb]);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsNotANerd);

        // Expect answer to be Isabella
        expect(answers.length).toBe(1);
        expect(answers[0].concepts.length).toBe(3);
        expect(answers[0].getConceptByLabel("Isabella")).toEqual(testScenarioProvider_PhineasAndFerb.isabella);
    })

    xit('Who is a bully and a boy', () => {
        const whoIsABullyAndABoy: ConceptualGraph = new ConceptualGraph();
        const who: Concept = whoIsABullyAndABoy.createConcept("Who", ["Bully", "Boy"], DesignatorType.LAMBDA);

        const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsABullyAndABoy);

        // Expect answer to be Buford
        expect(answers.length).toBe(1);
        expect(answers[0].concepts.length).toBe(1);
        expect(answers[0].getConceptByLabel("Buford")).toEqual(testScenarioProvider_PhineasAndFerb.buford);
    })


})