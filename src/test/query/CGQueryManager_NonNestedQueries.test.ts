import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept, DesignatorType } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { ConceptualGraphQueryManager } from "../../main/query/ConceptualGraphQueryManager";
import { QueryManager } from "../../main/query/QueryManager";
import { IdGenerator } from "../../main/util/IdGenerator";
import { TestScenarioProvider_TomAndJerry } from "../testutil/TestScenarioProvider_TomAndJerry";
import { TestScenarioProvider_PhineasAndFerb } from "../testutil/TestScenarioProvider_PhineasAndFerb";
import { FactDao, InMemoryFactDao } from "../../main/conceptual-graphs";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: FactDao = new InMemoryFactDao(conceptDao, relationDao);
const testScenarioProvider_JerryTheMouse: TestScenarioProvider_TomAndJerry = new TestScenarioProvider_TomAndJerry(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);
const testScenarioProvider_PhineasAndFerb: TestScenarioProvider_PhineasAndFerb = new TestScenarioProvider_PhineasAndFerb(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);

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
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown
        const jerryTheMouseIsColourBrown: ConceptualGraph = testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrown(testId);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const brownConceptLabel: string = "Brown-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryTheMouseIsColourBrown;

        // Create Query: What colour is the bird Jerry?
        const whatColourIsJerryQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsJerryQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        })
        const jerryInQuery: Concept = whatColourIsJerryQuery.createConcept("JerryInQuery", birdConceptTypeLabel, jerryConceptLabel);
        whatColourIsJerryQuery.createRelation("query-whatcolor-attr-jerry", attributeRelationTypeLabel, [jerryInQuery, whatColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsJerryQuery);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Brown
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toEqual({
            id: undefined,
            label: "Brown-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Brown-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "JerryInQuery"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatcolor-attr-jerry",
        });
    })

    it('Query with two relations and three concepts: Exact Concept Types | Exact Relation Types | Match all nodes | Multiple Answers', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown and blue
        const jerryIsBrownAndBlue: ConceptualGraph = testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrownAndBlue(testId);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const brownConceptLabel: string = "Brown-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryIsBrownAndBlue;

        // Create Query: What colour is the bird Jerry?
        const whatColourIsJerryQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsJerryQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        })
        const jerryInQuery: Concept = whatColourIsJerryQuery.createConcept("JerryInQuery", birdConceptTypeLabel, jerryConceptLabel);
        whatColourIsJerryQuery.createRelation("query-jerry-attr-whatcolor", attributeRelationTypeLabel, [jerryInQuery, whatColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsJerryQuery);

        // Expect single answer
        expect(matches.length).toBe(2);

        // Expect First answer to be: Brown
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toEqual({
            id: undefined,
            label: "Brown-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Brown-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "JerryInQuery"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-jerry-attr-whatcolor",
        });

        // Expect Second answer to be: Blue
        expect(matches[1].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[1].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "JerryInQuery"
        });
        expect(matches[1].getRelationByLabel(jerryAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-jerry-attr-whatcolor",
        });
    })

    it('Project answer nodes without returning whole: Exact Concept Types | Exact Relation Types | Extract only answer nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown and blue
        const jerryIsBrownAndBlue: ConceptualGraph = testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrownAndBlue(testId);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const brownConceptLabel: string = "Brown-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryIsBrownAndBlue;

        // Create Query: What colour is the bird Jerry?
        const whatColourIsJerryQuery: ConceptualGraph = new ConceptualGraph();
        const whatBlueColour: Concept = whatColourIsJerryQuery.createConcept("BlueInQuery", colourConceptTypeLabel, blueConceptLabel);
        const whatMouse: Concept = whatColourIsJerryQuery.createConcept("WhatMouse", birdConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        });
        whatColourIsJerryQuery.createRelation("query-whatbird-attr-blue", attributeRelationTypeLabel, [whatMouse, whatBlueColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsJerryQuery);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatMouse"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatbird-attr-blue",
        });
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toBeUndefined();
    })

    it('Match Sub Concepts Types: Parent Concept Types | Exact Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown and blue
        const jerryTheMouseIsColourBrownAndBlueWithSubConceptTypes: ConceptualGraph =
            testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrownAndBlueWithSubConceptTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryTheMouseIsColourBrownAndBlueWithSubConceptTypes;

        // Create Query: What colour is the bird Jerry?
        const whatAnimalIsBrown: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsBrown.createConcept("WhatAnimal", animalConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsBrown.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsBrown.createRelation("query-whatanimal-attr-blue", attributeRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsBrown);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
    })

    it('Match Sub Relation Types: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown and blue
        const jerryTheMouseIsColourBrownAndBlueWithSubRelationTypes: ConceptualGraph =
            testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrownAndBlueWithSubRelationTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryTheMouseIsColourBrownAndBlueWithSubRelationTypes;

        // Create Query: What colour is the bird Jerry?
        const whatAnimalIsBrown: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsBrown.createConcept("WhatAnimal", animalConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsBrown.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsBrown.createRelation("query-whatanimal-attr-blue", propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsBrown);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
    })

    it('Matching relations should match concepts exactly: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Jerry the bird is brown and blue
        const jerryTheMouseIsColourBrownAndBlueWithReverseRelation: ConceptualGraph =
            testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrownAndBlueWithReverseRelation(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const blueAttrJerryRelationLabel: string = "blue-attribute-jerry-reverse-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryTheMouseIsColourBrownAndBlueWithReverseRelation;

        // Create Query: What colour is the bird Jerry?
        const whatAnimalIsBrown: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsBrown.createConcept("WhatAnimal", animalConceptTypeLabel, {
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsBrown.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsBrown.createRelation("query-whatanimal-attr-blue", propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsBrown);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect Second answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
        expect(matches[0].getRelationByLabel(blueAttrJerryRelationLabel)).toBeUndefined();
    })

    it('Match 3 Lambdas: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const threeAnimalsWithColourAndAllThreeCute: ConceptualGraph =
            testScenarioProvider_JerryTheMouse.getConcept_threeAnimalsWithColourAndAllThreeCute(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const cuteConceptTypeLabel: string = "Cute-" + testId;

        const attributeRelationTypeLabel: string = "Attribute-" + testId;

        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const tomAttrBlueRelationLabel: string = "tom-attribute-blue-" + testId;
        const spikeAttrRedRelationLabel: string = "spike-attribute-red-" + testId;

        const jerryConceptLabel: string = "Jerry-" + testId;
        const tomConceptLabel: string = "Tom-" + testId;
        const spikeConceptLabel: string = "Spike-" + testId;
        const brownConceptLabel: string = "Brown-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        const redConceptLabel: string = "Red-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = threeAnimalsWithColourAndAllThreeCute;

        // Create Query: Which Animals have colour and are cute?
        const whichAnimalsHaveColourAndAreCute: ConceptualGraph = new ConceptualGraph();
        const whatAnimalInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("WhatAnimal", animalConceptTypeLabel, DesignatorType.LAMBDA)
        const colourInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        whichAnimalsHaveColourAndAreCute.createRelation("query-whatanimal-attr-whatcolour", attributeRelationTypeLabel, [whatAnimalInQuery, colourInQuery]);

        const cuteInQuery: Concept = whichAnimalsHaveColourAndAreCute.createConcept("AnyCute", cuteConceptTypeLabel, DesignatorType.LAMBDA);
        whichAnimalsHaveColourAndAreCute.createRelation("query-whatanimal-attr-cute", attributeRelationTypeLabel, [whatAnimalInQuery, cuteInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whichAnimalsHaveColourAndAreCute);

        // Expect single answer
        expect(matches.length).toBe(3);

        // Expect First answer to be: Jerry is brown
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toEqual({
            id: undefined,
            label: "Brown-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Brown-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const jerryAttrBrownRelationInAnswer: Relation = matches[0].getRelationByLabel(jerryAttrBrownRelationLabel);
        expect(jerryAttrBrownRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[0].getConceptByLabel(jerryConceptLabel).label);
        expect(jerryAttrBrownRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[0].getConceptByLabel(brownConceptLabel).label);

        // Expect Second answer to be: Tom is blue
        expect(matches[1].getConceptByLabel(tomConceptLabel)).toEqual({
            id: undefined,
            label: "Tom-" + testId,
            conceptTypeLabels: ["Cat-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Tom-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[1].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[1].getRelationByLabel(tomAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "tom-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Tom-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const tomAttrBlueRelationInAnswer: Relation = matches[1].getRelationByLabel(tomAttrBlueRelationLabel);
        expect(tomAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[1].getConceptByLabel(tomConceptLabel).label);
        expect(tomAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[1].getConceptByLabel(blueConceptLabel).label);

        // Expect Second answer to be: Spike is red
        expect(matches[2].getConceptByLabel(spikeConceptLabel)).toEqual({
            id: undefined,
            label: "Spike-" + testId,
            conceptTypeLabels: ["Dog-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Spike-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[2].getConceptByLabel(redConceptLabel)).toEqual({
            id: undefined,
            label: "Red-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Red-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[2].getRelationByLabel(spikeAttrRedRelationLabel)).toEqual({
            id: undefined,
            label: "spike-attribute-red-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Spike-" + testId,
                "Red-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const spikeAttrBllueRelationInAnswer: Relation = matches[2].getRelationByLabel(spikeAttrRedRelationLabel);
        expect(spikeAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[2].getConceptByLabel(spikeConceptLabel).label);
        expect(spikeAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[2].getConceptByLabel(redConceptLabel).label);
    })

    it('Direct Cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const brownHasAttributeBrown: ConceptualGraph =
            testScenarioProvider_JerryTheMouse.getConcept_brownHasAttributeBrown(testId);
        const brownConceptLabel: string = "Brown-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const brownAttrBrownRelationLabel: string = "brown-attribute-brown-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = brownHasAttributeBrown;

        // Create Query: What Colour is Brown
        const whatColourIsBrown: ConceptualGraph = new ConceptualGraph();
        const brownInQuery: Concept = whatColourIsBrown.createConcept("QueryBrown", colourConceptTypeLabel, brownConceptLabel);
        const colourInQuery: Concept = whatColourIsBrown.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        whatColourIsBrown.createRelation("query-brown-attr-whatcolour", attributeRelationTypeLabel, [brownInQuery, colourInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsBrown);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Brown is brown
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toEqual({
            id: undefined,
            label: "Brown-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Brown-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(brownAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "brown-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Brown-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-brown-attr-whatcolour",
        });
    })

    it('Two level deep cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const jerryHasAttributeBrownHasAttributeJerry: ConceptualGraph =
        testScenarioProvider_JerryTheMouse.getConcept_jerryHasAttributeBrownHasAttributeJerry(testId);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        const jerryConceptLabel: string = "Jerry-" + testId;
        const brownConceptLabel: string = "Brown-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const brownAttrJerryRelationLabel: string = "brown-attribute-jerry-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = jerryHasAttributeBrownHasAttributeJerry;

        // Create Query: What Colour is the colour that jerry is
        const whatColourIsJerry: ConceptualGraph = new ConceptualGraph();
        const colourInQuery: Concept = whatColourIsJerry.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        const jerryInQuery: Concept = whatColourIsJerry.createConcept("SomeMouse", birdConceptTypeLabel, jerryConceptLabel);
        whatColourIsJerry.createRelation("query-jerry-attr-whatcolour", attributeRelationTypeLabel, [jerryInQuery, colourInQuery]);
        whatColourIsJerry.createRelation("query-whatcolour-attr-jerry", attributeRelationTypeLabel, [colourInQuery, jerryInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsJerry);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Brown is brown
        expect(matches[0].concepts.length).toBe(2);
        expect(matches[0].getConceptByLabel(jerryConceptLabel)).toEqual({
            id: undefined,
            label: "Jerry-" + testId,
            conceptTypeLabels: ["Mouse-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Jerry-" + testId,
            },
            templateConceptLabelWhichWasMatched: "SomeMouse"
        });
        expect(matches[0].getConceptByLabel(brownConceptLabel)).toEqual({
            id: undefined,
            label: "Brown-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                designatorType: "LITERAL",
                designatorValue: "Brown-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(jerryAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-jerry-attr-whatcolour",
        });
        expect(matches[0].getRelationByLabel(jerryAttrBrownRelationLabel)).toEqual({
            id: undefined,
            label: "jerry-attribute-brown-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Jerry-" + testId,
                "Brown-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-jerry-attr-whatcolour",
        });
    })

})

// describe('A more complex scenario. Phineas and Ferb structure', () => {

//     beforeAll(() => {
//         testScenarioProvider_PhineasAndFerb.createPhineasAndFerbStructure();
//     })

//     beforeEach(() => {
//         testId = IdGenerator.getInstance().getNextUniquTestId();
//         global.console = require('console');
//     })

//     it('Who are the siblings of Phineas', () => {
//         const whoAreSiblingsOfPhineas: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoAreSiblingsOfPhineas.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const phineas: Concept = whoAreSiblingsOfPhineas.createConcept("PhineasInQuery", "Human", "Phineas");
//         whoAreSiblingsOfPhineas.createRelation("who-siblingOf-phineas", "SiblingOf", [who, phineas]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreSiblingsOfPhineas);

//         // Expect answer to be Ferb and Candace
//         expect(answers.length).toBe(2);
//         expect(answers[0].concepts.length).toBe(2);
//         expect(answers[0].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
//         expect(answers[1].concepts.length).toBe(2);
//         expect(answers[1].getConceptByLabel("Candace")).toEqual(testScenarioProvider_PhineasAndFerb.candace);
//     })

//     it('Who are the children of Lindana and Lawrence', () => {
//         const whoAreChildrenOfLindanaAndLawrence: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const lindana: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("LindanaQuery", "Human", "Lindana");
//         const lawrence: Concept = whoAreChildrenOfLindanaAndLawrence.createConcept("LawrenceQuery", "Human", "Lawrence");
//         whoAreChildrenOfLindanaAndLawrence.createRelation("who-childOf-lindana", "ChildOf", [who, lindana]);
//         whoAreChildrenOfLindanaAndLawrence.createRelation("who-childOf-lawrence", "ChildOf", [who, lawrence]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreChildrenOfLindanaAndLawrence);

//         // Expect answer to be Phineas, Ferb and Candace
//         expect(answers.length).toBe(3);
//         expect(answers[0].concepts.length).toBe(3);
//         expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
//         expect(answers[1].concepts.length).toBe(3);
//         expect(answers[1].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
//         expect(answers[2].concepts.length).toBe(3);
//         expect(answers[2].getConceptByLabel("Candace")).toEqual(testScenarioProvider_PhineasAndFerb.candace);
//     })

//     it('Who is the step son of Lawrence', () => {
//         const whoIsTheStepsonOfLawrence: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoIsTheStepsonOfLawrence.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const lawrence: Concept = whoIsTheStepsonOfLawrence.createConcept("LawrenceQuery", "Human", "Lawrence");
//         whoIsTheStepsonOfLawrence.createRelation("who-stepChildOf-lawrence", "StepSonOf", [who, lawrence]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsTheStepsonOfLawrence);

//         // Expect answer to be Phineas
//         expect(answers.length).toBe(1);
//         expect(answers[0].concepts.length).toBe(2);
//         expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
//     })

//     it('Who are the step siblings of Candace', () => {
//         const whoAreStepSiblingsOfCandace: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoAreStepSiblingsOfCandace.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const candace: Concept = whoAreStepSiblingsOfCandace.createConcept("Candace", "Human", "Candace");
//         whoAreStepSiblingsOfCandace.createRelation("who-stepSiblingOf-candace", "StepBrotherOf", [who, candace]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoAreStepSiblingsOfCandace);

//         // Expect answer to be Ferb
//         expect(answers.length).toBe(1);
//         expect(answers[0].concepts.length).toBe(2);
//         expect(answers[0].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
//     })

//     it('Who have a mom and a dad and a pet platypus and a friend named baljeet', () => {
//         const whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const someMom: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomeMom", "Human", DesignatorType.LAMBDA);
//         const someDad: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomeDad", "Human", DesignatorType.LAMBDA);
//         const somePlatypus: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("SomePlatypus", "Platypus", DesignatorType.LAMBDA);
//         const baljeet: Concept = whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createConcept("BaljeetInQuery", "Boy", "Baljeet");
//         whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("somemom-motherOf-who", "MotherOf", [someMom, who]);
//         whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("somedad-fatherOf-who", "FatherOf", [someDad, who]);
//         whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("who-ownsPet-platypus", "OwnsPet", [who, somePlatypus]);
//         whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet.createRelation("who-friendOf-baljeet", "FriendOf", [who, baljeet]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoHaveMomAndDadAndPetPlatypusAndFriendBaljeet);

//         // Expect answer to be Ferb and Phineas
//         expect(answers.length).toBe(2);
//         expect(answers[0].concepts.length).toBe(5);
//         expect(answers[0].getConceptByLabel("Phineas")).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
//         expect(answers[1].concepts.length).toBe(5);
//         expect(answers[1].getConceptByLabel("Ferb")).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
//     })

//     it('Which animals are pets to children who are friends with buford', () => {
//         const whichAnimalIsPetToChildFriendOfBuford: ConceptualGraph = new ConceptualGraph();
//         const whichAnimal: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("WhichAnimal", "Animal", DesignatorType.LAMBDA);
//         const someChild: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("SomeChild", "Human", DesignatorType.LAMBDA);
//         const buford: Concept = whichAnimalIsPetToChildFriendOfBuford.createConcept("BufordInQuery", "Human", "Buford");
//         whichAnimalIsPetToChildFriendOfBuford.createRelation("somechild-ownsPet-whichanimal", "OwnsPet", [someChild, whichAnimal]);
//         whichAnimalIsPetToChildFriendOfBuford.createRelation("somechild-friendOf-buford", "FriendOf", [someChild, buford]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whichAnimalIsPetToChildFriendOfBuford);

//         // Expect answer to be Perry and Pinky
//         expect(answers.length).toBe(3);
//         expect(answers[0].concepts.length).toBe(3);
//         expect(answers[0].getConceptByLabel("PerryThePlatypus")).toEqual(testScenarioProvider_PhineasAndFerb.perryThePlatypus);
//         expect(answers[1].concepts.length).toBe(3);
//         expect(answers[1].getConceptByLabel("PerryThePlatypus")).toEqual(testScenarioProvider_PhineasAndFerb.perryThePlatypus);
//         expect(answers[2].concepts.length).toBe(3);
//         expect(answers[2].getConceptByLabel("PinkyTheChihuahua")).toEqual(testScenarioProvider_PhineasAndFerb.pinkyTheChihuahua);
//     })

//     it('Who is not nerdy', () => {
//         const whoIsNotANerd: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoIsNotANerd.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const nerdy: Concept = whoIsNotANerd.createConcept("Nerdy", "Property", "Nerdy");
//         whoIsNotANerd.createRelation("who-attr-nerdy", "Attribute", [who, nerdy]);
//         whoIsNotANerd.createRelation("not-nerdy", "Not", [nerdy]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsNotANerd);

//         // Expect answer to be Buford
//         expect(answers.length).toBe(1);
//         expect(answers[0].concepts.length).toBe(2);
//         expect(answers[0].getConceptByLabel("Buford")).toEqual(testScenarioProvider_PhineasAndFerb.buford);
//         expect(answers[0].getConceptByLabel("Nerdy")).toEqual(testScenarioProvider_PhineasAndFerb.nerdy);
//         expect(answers[0].getRelationsWhereConceptIsUsed(answers[0].getConceptByLabel("Nerdy"))[0]).toEqual(relationDao.getRelationByLabel("not-nerdy"));
//     })

//     it('Who is between phineas and ferb', () => {
//         const whoIsNotANerd: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoIsNotANerd.createConcept("Who", "Human", DesignatorType.LAMBDA);
//         const phineas: Concept = whoIsNotANerd.createConcept("Phineas", "Human", "Phineas");
//         const ferb: Concept = whoIsNotANerd.createConcept("Ferb", "Human", "Ferb");
//         whoIsNotANerd.createRelation("who-between-phineas-and-ferb", "Between", [who, phineas, ferb]);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsNotANerd);

//         // Expect answer to be Isabella
//         expect(answers.length).toBe(1);
//         expect(answers[0].concepts.length).toBe(3);
//         expect(answers[0].getConceptByLabel("Isabella")).toEqual(testScenarioProvider_PhineasAndFerb.isabella);
//     })

//     xit('Who is a bully and a boy', () => {
//         const whoIsABullyAndABoy: ConceptualGraph = new ConceptualGraph();
//         const who: Concept = whoIsABullyAndABoy.createConcept("Who", ["Bully", "Boy"], DesignatorType.LAMBDA);

//         const answers: ConceptualGraph[] = queryManager.executeQuery(whoIsABullyAndABoy);

//         // Expect answer to be Buford
//         expect(answers.length).toBe(1);
//         expect(answers[0].concepts.length).toBe(1);
//         expect(answers[0].getConceptByLabel("Buford")).toEqual(testScenarioProvider_PhineasAndFerb.buford);
//     })


// })