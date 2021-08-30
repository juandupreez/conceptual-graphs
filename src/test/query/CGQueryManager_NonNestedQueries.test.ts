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
import { ConceptualGraphQueryManager } from "../../main/query/ConceptualGraphQueryManager";
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

        // Create Conceptual graph: Flynt the bird is yellow
        const flyntTheBirdIsColourYellow: ConceptualGraph = testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellow(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntTheBirdIsColourYellow;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsFlyntQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const flyntInQuery: Concept = whatColourIsFlyntQuery.createConcept("FlyntInQuery", birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlyntQuery.createRelation("query-whatcolor-attr-flynt", attributeRelationTypeLabel, [flyntInQuery, whatColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Yellow
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toEqual({
            id: undefined,
            label: "Yellow-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Yellow-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "FlyntInQuery"
        });
        expect(matches[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatcolor-attr-flynt",
        });
    })

    it('Query with two relations and three concepts: Exact Concept Types | Exact Relation Types | Match all nodes | Multiple Answers', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Flynt the bird is yellow and blue
        const flyntIsYellowAndBlue: ConceptualGraph = testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellowAndBlue(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntIsYellowAndBlue;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatColour: Concept = whatColourIsFlyntQuery.createConcept("WhatColour", colourConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const flyntInQuery: Concept = whatColourIsFlyntQuery.createConcept("FlyntInQuery", birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlyntQuery.createRelation("query-flynt-attr-whatcolor", attributeRelationTypeLabel, [flyntInQuery, whatColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(matches.length).toBe(2);

        // Expect First answer to be: Yellow
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toEqual({
            id: undefined,
            label: "Yellow-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Yellow-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "FlyntInQuery"
        });
        expect(matches[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-flynt-attr-whatcolor",
        });

        // Expect Second answer to be: Blue
        expect(matches[1].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[1].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "FlyntInQuery"
        });
        expect(matches[1].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-flynt-attr-whatcolor",
        });
    })

    it('Project answer nodes without returning whole: Exact Concept Types | Exact Relation Types | Extract only answer nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Flynt the bird is yellow and blue
        const flyntIsYellowAndBlue: ConceptualGraph = testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellowAndBlue(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntIsYellowAndBlue;

        // Create Query: What colour is the bird Flynt?
        const whatColourIsFlyntQuery: ConceptualGraph = new ConceptualGraph();
        const whatBlueColour: Concept = whatColourIsFlyntQuery.createConcept("BlueInQuery", colourConceptTypeLabel, blueConceptLabel);
        const whatBird: Concept = whatColourIsFlyntQuery.createConcept("WhatBird", birdConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        });
        whatColourIsFlyntQuery.createRelation("query-whatbird-attr-blue", attributeRelationTypeLabel, [whatBird, whatBlueColour]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlyntQuery);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatBird"
        });
        expect(matches[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatbird-attr-blue",
        });
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toBeUndefined();
    })

    it('Match Sub Concepts Types: Parent Concept Types | Exact Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Flynt the bird is yellow and blue
        const flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes: ConceptualGraph =
            testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes;

        // Create Query: What colour is the bird Flynt?
        const whatAnimalIsYellow: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsYellow.createConcept("WhatAnimal", animalConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsYellow.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsYellow.createRelation("query-whatanimal-attr-blue", attributeRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsYellow);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
    })

    it('Match Sub Relation Types: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Flynt the bird is yellow and blue
        const flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes: ConceptualGraph =
            testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes;

        // Create Query: What colour is the bird Flynt?
        const whatAnimalIsYellow: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsYellow.createConcept("WhatAnimal", animalConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsYellow.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsYellow.createRelation("query-whatanimal-attr-blue", propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsYellow);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
    })

    it('Matching relations should match concepts exactly: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        // Create Conceptual graph: Flynt the bird is yellow and blue
        const flyntTheBirdIsColourYellowAndBlueWithReverseRelation: ConceptualGraph =
            testScenarioProvider_FlyntTheBird.getConcept_flyntTheBirdIsColourYellowAndBlueWithReverseRelation(testId);
        const animalConceptTypeLabel: string = "Animal-" + testId;
        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        const propertyRelationTypeLabel: string = "Property-" + testId;
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const blueAttrFlyntRelationLabel: string = "blue-attribute-flynt-reverse-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const blueConceptLabel: string = "Blue-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntTheBirdIsColourYellowAndBlueWithReverseRelation;

        // Create Query: What colour is the bird Flynt?
        const whatAnimalIsYellow: ConceptualGraph = new ConceptualGraph();
        const whatAnimal: Concept = whatAnimalIsYellow.createConcept("WhatAnimal", animalConceptTypeLabel, {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LAMBDA
        })
        const shadeOfLightInQuery: Concept = whatAnimalIsYellow.createConcept("BlueInQuery", shadeOfLightConceptTypeLabel, blueConceptLabel);
        whatAnimalIsYellow.createRelation("query-whatanimal-attr-blue", propertyRelationTypeLabel, [whatAnimal, shadeOfLightInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatAnimalIsYellow);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect Second answer to be: Blue
        expect(matches[0].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "BlueInQuery"
        });
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getRelationByLabel(flyntAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-blue",
        });
        expect(matches[0].getRelationByLabel(blueAttrFlyntRelationLabel)).toBeUndefined();
    })

    it('Match 3 Lambdas: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const threeAnimalsWithColourAndAllThreeCute: ConceptualGraph =
            testScenarioProvider_FlyntTheBird.getConcept_threeAnimalsWithColourAndAllThreeCute(testId);
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

        // Expect First answer to be: Flynt is yellow
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toEqual({
            id: undefined,
            label: "Yellow-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Yellow-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const flyntAttrYellowRelationInAnswer: Relation = matches[0].getRelationByLabel(flyntAttrYellowRelationLabel);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[0].getConceptByLabel(flyntConceptLabel).label);
        expect(flyntAttrYellowRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[0].getConceptByLabel(yellowConceptLabel).label);

        // Expect Second answer to be: Rhysand is blue
        expect(matches[1].getConceptByLabel(rhysandConceptLabel)).toEqual({
            id: undefined,
            label: "Rhysand-" + testId,
            conceptTypeLabels: ["Cat-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Rhysand-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[1].getConceptByLabel(blueConceptLabel)).toEqual({
            id: undefined,
            label: "Blue-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Blue-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[1].getRelationByLabel(rhysandAttrBlueRelationLabel)).toEqual({
            id: undefined,
            label: "rhysand-attribute-blue-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Rhysand-" + testId,
                "Blue-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const rhysandAttrBlueRelationInAnswer: Relation = matches[1].getRelationByLabel(rhysandAttrBlueRelationLabel);
        expect(rhysandAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[1].getConceptByLabel(rhysandConceptLabel).label);
        expect(rhysandAttrBlueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[1].getConceptByLabel(blueConceptLabel).label);

        // Expect Second answer to be: Rusky is red
        expect(matches[2].getConceptByLabel(ruskyConceptLabel)).toEqual({
            id: undefined,
            label: "Rusky-" + testId,
            conceptTypeLabels: ["Dog-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Rusky-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatAnimal"
        });
        expect(matches[2].getConceptByLabel(redConceptLabel)).toEqual({
            id: undefined,
            label: "Red-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Red-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[2].getRelationByLabel(ruskyAttrRedRelationLabel)).toEqual({
            id: undefined,
            label: "rusky-attribute-red-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Rusky-" + testId,
                "Red-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-whatanimal-attr-whatcolour",
        });
        const ruskyAttrBllueRelationInAnswer: Relation = matches[2].getRelationByLabel(ruskyAttrRedRelationLabel);
        expect(ruskyAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[2].getConceptByLabel(ruskyConceptLabel).label);
        expect(ruskyAttrBllueRelationInAnswer.conceptArgumentLabels).toContainEqual(matches[2].getConceptByLabel(redConceptLabel).label);
    })

    it('Direct Cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const yellowHasAttributeYellow: ConceptualGraph =
            testScenarioProvider_FlyntTheBird.getConcept_yellowHasAttributeYellow(testId);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const yellowAttrYellowRelationLabel: string = "yellow-attribute-yellow-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = yellowHasAttributeYellow;

        // Create Query: What Colour is Yellow
        const whatColourIsYellow: ConceptualGraph = new ConceptualGraph();
        const yellowInQuery: Concept = whatColourIsYellow.createConcept("QueryYellow", colourConceptTypeLabel, yellowConceptLabel);
        const colourInQuery: Concept = whatColourIsYellow.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        whatColourIsYellow.createRelation("query-yellow-attr-whatcolour", attributeRelationTypeLabel, [yellowInQuery, colourInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsYellow);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Yellow is yellow
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toEqual({
            id: undefined,
            label: "Yellow-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Yellow-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(yellowAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "yellow-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Yellow-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-yellow-attr-whatcolour",
        });
    })

    it('Two level deep cycles: Parent Concept Types | Parent Relation Types | Match all nodes | Single Answer', () => {
        const queryManager: QueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);

        const flyntHasAttributeYellowHasAttributeFlynt: ConceptualGraph =
        testScenarioProvider_FlyntTheBird.getConcept_flyntHasAttributeYellowHasAttributeFlynt(testId);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        const flyntConceptLabel: string = "Flynt-" + testId;
        const yellowConceptLabel: string = "Yellow-" + testId;
        const colourConceptTypeLabel: string = "Colour-" + testId;
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const yellowAttrFlyntRelationLabel: string = "yellow-attribute-flynt-" + testId;
        (queryManager as ConceptualGraphQueryManager).conceptualGraphToMatch = flyntHasAttributeYellowHasAttributeFlynt;

        // Create Query: What Colour is the colour that flynt is
        const whatColourIsFlynt: ConceptualGraph = new ConceptualGraph();
        const colourInQuery: Concept = whatColourIsFlynt.createConcept("WhatColour", colourConceptTypeLabel, DesignatorType.LAMBDA);
        const flyntInQuery: Concept = whatColourIsFlynt.createConcept("SomeBird", birdConceptTypeLabel, flyntConceptLabel);
        whatColourIsFlynt.createRelation("query-flynt-attr-whatcolour", attributeRelationTypeLabel, [flyntInQuery, colourInQuery]);
        whatColourIsFlynt.createRelation("query-whatcolour-attr-flynt", attributeRelationTypeLabel, [colourInQuery, flyntInQuery]);

        // Run query against data
        const matches: ConceptualGraph[] = queryManager.executeQuery(whatColourIsFlynt);

        // Expect single answer
        expect(matches.length).toBe(1);

        // Expect First answer to be: Yellow is yellow
        expect(matches[0].concepts.length).toBe(2);
        expect(matches[0].getConceptByLabel(flyntConceptLabel)).toEqual({
            id: undefined,
            label: "Flynt-" + testId,
            conceptTypeLabels: ["Bird-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Flynt-" + testId,
            },
            templateConceptLabelWhichWasMatched: "SomeBird"
        });
        expect(matches[0].getConceptByLabel(yellowConceptLabel)).toEqual({
            id: undefined,
            label: "Yellow-" + testId,
            conceptTypeLabels: ["Colour-" + testId],
            referent: {
                quantifierType: "A_SINGLE",
                quantifierValue: undefined,
                designatorType: "LITERAL",
                designatorValue: "Yellow-" + testId,
            },
            templateConceptLabelWhichWasMatched: "WhatColour"
        });
        expect(matches[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-flynt-attr-whatcolour",
        });
        expect(matches[0].getRelationByLabel(flyntAttrYellowRelationLabel)).toEqual({
            id: undefined,
            label: "flynt-attribute-yellow-" + testId,
            relationTypeLabels: [
                "Attribute-" + testId,
            ],
            conceptArgumentLabels: [
                "Flynt-" + testId,
                "Yellow-" + testId,
            ],
            templateRelationLabelWhichWasMatched: "query-flynt-attr-whatcolour",
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