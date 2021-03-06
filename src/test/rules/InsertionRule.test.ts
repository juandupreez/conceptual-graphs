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
import { Rule } from "../../main/rules/Rule";
import { InsertionRule } from "../../main/rules/InsertionRule";
import { IdGenerator } from "../../main/util/IdGenerator";
import { TestScenarioProvider_TomAndJerry } from "../testutil/TestScenarioProvider_TomAndJerry";
import { TestScenarioProvider_PhineasAndFerb } from "../testutil/TestScenarioProvider_PhineasAndFerb";
import { doesConceptualGraphAContainAllNodesOfConceptualGraphB } from "../../main/util/ConceptualGraphUtil";
import { FactDao, InMemoryFactDao } from "../../main/conceptual-graphs";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: FactDao = new InMemoryFactDao(conceptDao, relationDao);
const testScenarioProvider_JerryTheMouse: TestScenarioProvider_TomAndJerry = new TestScenarioProvider_TomAndJerry(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);
const testScenarioProvider_PhineasAndFerb: TestScenarioProvider_PhineasAndFerb = new TestScenarioProvider_PhineasAndFerb(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);


let testId: string = "";

describe('Simple Insertion', () => {

    beforeAll(() => {
        testScenarioProvider_PhineasAndFerb.createPhineasAndFerbStructure();
    })

    beforeEach(() => {
        testId = IdGenerator.getInstance().getNextUniquTestId();
        global.console = require('console');
    })

    it('Add a new single relation', () => {
        // Rule: If Phineas is brother of Candace, then Candace is sister of Phineas
        // Create rule: if boy is brother of girl then girl is sister of boy
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenGirlSisOfBoyRule: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: if boy is brother of girl
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someBoy: Concept = boyBroOfGirlHypothesis.createConcept("SomeBoy", "Boy", DesignatorType.LAMBDA);
        const someGirl: Concept = boyBroOfGirlHypothesis.createConcept("SomeGirl", "Girl", DesignatorType.LAMBDA);
        boyBroOfGirlHypothesis.createRelation("someboy-broof-somegirl", "BrotherOf", [someBoy, someGirl]);
        ifBoyBroOfGirlThenGirlSisOfBoyRule.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then girl is sister of boy
        const girlBroOfBoyConclusion: ConceptualGraph = new ConceptualGraph();
        girlBroOfBoyConclusion.addConcept(someBoy);
        girlBroOfBoyConclusion.addConcept(someGirl);
        girlBroOfBoyConclusion.createRelation("somegirl-sisof-someboy", "SisterOf", [someGirl, someBoy]);
        ifBoyBroOfGirlThenGirlSisOfBoyRule.conclusion = girlBroOfBoyConclusion;

        // Create Phineas and Candace Conceptual Graph
        const phineasAndCandaceCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasAndCandaceCG();

        // Apply Rule
        const insertedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenGirlSisOfBoyRule.applyRule(phineasAndCandaceCG);

        // Expect there to be a sister of relation
        expect(insertedPhineasAndCandaceCG.relations.length).toBe(2);
        expect(insertedPhineasAndCandaceCG.relations[0]).toEqual({
            label: "phineas-broOf-candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Phineas", "Candace"],
            id: undefined,
        });
        expect(insertedPhineasAndCandaceCG.relations[1]).toEqual({
            id: undefined,
            label: "Candace-SisterOf-Phineas",
            relationTypeLabels: ["SisterOf"],
            conceptArgumentLabels: ["Candace", "Phineas"]
        });

    })

    it('Add a new single relation and concept', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: if boy is brother of girl
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someBoy: Concept = boyBroOfGirlHypothesis.createConcept("SomeBoy", "Boy", DesignatorType.LAMBDA);
        const someGirl: Concept = boyBroOfGirlHypothesis.createConcept("SomeGirl", "Girl", DesignatorType.LAMBDA);
        boyBroOfGirlHypothesis.createRelation("someboy-broof-somegirl", "BrotherOf", [someBoy, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then Ferb is brother of girl
        const girlBroOfBoyConclusion: ConceptualGraph = new ConceptualGraph();
        girlBroOfBoyConclusion.addConcept(someGirl);
        girlBroOfBoyConclusion.addConcept(testScenarioProvider_PhineasAndFerb.ferb);
        girlBroOfBoyConclusion.createRelation("ferb-broof-somegirl", "BrotherOf", [testScenarioProvider_PhineasAndFerb.ferb, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.conclusion = girlBroOfBoyConclusion;

        // Create Phineas and Candace Conceptual Graph
        const phineasAndCandaceCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasAndCandaceCG();

        // Apply Rule
        const insertedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(phineasAndCandaceCG);

        // Expect there to be two brother relations
        expect(insertedPhineasAndCandaceCG.relations.length).toBe(2);
        expect(insertedPhineasAndCandaceCG.relations[0]).toEqual({
            ...relationDao.getRelationByLabel("phineas-broOf-candace"),
            id: undefined,
        });
        expect(insertedPhineasAndCandaceCG.relations[1]).toEqual({
            id: undefined,
            label: "Ferb-BrotherOf-Candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Ferb", "Candace"]
        });

        // Expect ferb to have been added
        expect(insertedPhineasAndCandaceCG.concepts.length).toBe(3);
        expect(insertedPhineasAndCandaceCG.concepts[0]).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(insertedPhineasAndCandaceCG.concepts[1]).toEqual(testScenarioProvider_PhineasAndFerb.candace);
        expect(insertedPhineasAndCandaceCG.concepts[2]).toEqual(testScenarioProvider_PhineasAndFerb.ferb);

    })

    it('Add several new concepts and relations', () => {
        // Rule: If Human is friend of Phineas and friend of Ferb, 
        //  then that Human is friend of Candace 
        //      and Candace is friend of that Human
        //      and Human is Friend of Perry the Platypus owned by Phineas and Ferb and Candace
        //      and that Human is friendly
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanIsFriendOfPhineasAndFerb: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: If Human is friend of Phineas and friend of Ferb
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someHuman: Concept = boyBroOfGirlHypothesis.createConcept("SomeHuman", "Human", DesignatorType.LAMBDA);
        const phineas: Concept = boyBroOfGirlHypothesis.createConcept("Phineas", "Boy", "Phineas");
        const ferb: Concept = boyBroOfGirlHypothesis.createConcept("Ferb", "Boy", "Ferb");
        boyBroOfGirlHypothesis.createRelation("somehuman-friendof-phineas", "FriendOf", [someHuman, phineas]);
        boyBroOfGirlHypothesis.createRelation("somehuman-friendof-ferb", "FriendOf", [someHuman, ferb]);
        ifHumanIsFriendOfPhineasAndFerb.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then that Human is friend of Candace 
        //  and Candace is friend of that Human
        //  and Human is friend of Perry the Platypus owned by Phineas and Ferb and Candace
        //  and Human is friendly
        const friendOfCandaceAndPerryConclusion: ConceptualGraph = new ConceptualGraph();
        friendOfCandaceAndPerryConclusion.addConcept(someHuman);
        friendOfCandaceAndPerryConclusion.addConcept(phineas);
        friendOfCandaceAndPerryConclusion.addConcept(ferb);
        const candace: Concept = friendOfCandaceAndPerryConclusion.createConcept("Candace", "Girl", "Candace");
        const perry: Concept = friendOfCandaceAndPerryConclusion.createConcept("PerryThePlatypus", "Platypus", "Perry");
        const friendly: Concept = friendOfCandaceAndPerryConclusion.createConcept("Friendly", "Property", "Friendly");
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-candace", "FriendOf", [someHuman, candace]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-friendOf-human", "FriendOf", [candace, someHuman]);
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-perry", "FriendOf", [someHuman, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("phineas-ownsPet-perry", "OwnsPet", [phineas, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("ferb-ownsPet-perry", "OwnsPet", [ferb, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-ownsPet-perry", "OwnsPet", [candace, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("human-attr-friendly", "Attribute", [someHuman, friendly]);
        ifHumanIsFriendOfPhineasAndFerb.conclusion = friendOfCandaceAndPerryConclusion;


        // console.log(ifHumanIsFriendOfPhineasAndFerb.toString());


        // Create Phineas and Ferb Friends Conceptual Graph
        const phineasFerbAndFriendsCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasFerbAndFriendsCG();

        // Apply Rule
        const insertedFriendsCG: ConceptualGraph = ifHumanIsFriendOfPhineasAndFerb.applyRule(phineasFerbAndFriendsCG);
        
        // console.log("\n\nInserted Graph:\n----------------\n" + insertedFriendsCG.toString());

        // Expect baljeet/buford/isabella to be friends of candace
        expect(insertedFriendsCG.getRelationByLabel("Baljeet-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "Candace"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Buford-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "Candace"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Isabella-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "Candace"]
        } as Relation);

        // Expect candace to be friends of baljeet/buford/isabella
        expect(insertedFriendsCG.getRelationByLabel("Candace-FriendOf-Baljeet")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Baljeet",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Baljeet"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Candace-FriendOf-Buford")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Buford",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Buford"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Candace-FriendOf-Isabella")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Isabella",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Isabella"]
        } as Relation);

        // Expect baljeet/buford/isabella to be friends of perry
        expect(insertedFriendsCG.getRelationByLabel("Baljeet-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "PerryThePlatypus"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Buford-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "PerryThePlatypus"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Isabella-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "PerryThePlatypus"]
        } as Relation);

        // Expect perry to be pet of phineas/ferb/candace
        expect(insertedFriendsCG.getRelationByLabel("Phineas-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Phineas-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Phineas", "PerryThePlatypus"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Ferb-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Ferb-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Ferb", "PerryThePlatypus"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Candace-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Candace-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Candace", "PerryThePlatypus"]
        } as Relation);

        // Expect baljeet/buford/isabella to be friendly
        expect(insertedFriendsCG.getRelationByLabel("Baljeet-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Baljeet-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Baljeet", "Friendly"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Buford-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Buford-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Buford", "Friendly"]
        } as Relation);
        expect(insertedFriendsCG.getRelationByLabel("Isabella-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Isabella-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Isabella", "Friendly"]
        } as Relation);

    })

    it('New graph should contain all nodes of the original graph', () => {
        // Rule: If Human is friend of Phineas and friend of Ferb, 
        //  then that Human is friend of Candace 
        //      and Candace is friend of that Human
        //      and Human is Friend of Perry the Platypus owned by Phineas and Ferb and Candace
        //      and that Human is friendly
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanIsFriendOfPhineasAndFerb: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: If Human is friend of Phineas and friend of Ferb
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someHuman: Concept = boyBroOfGirlHypothesis.createConcept("SomeHuman", "Human", DesignatorType.LAMBDA);
        const phineas: Concept = boyBroOfGirlHypothesis.createConcept("Phineas", "Boy", "Phineas");
        const ferb: Concept = boyBroOfGirlHypothesis.createConcept("Ferb", "Boy", "Ferb");
        boyBroOfGirlHypothesis.createRelation("somehuman-friendof-phineas", "FriendOf", [someHuman, phineas]);
        boyBroOfGirlHypothesis.createRelation("somehuman-friendof-ferb", "FriendOf", [someHuman, ferb]);
        ifHumanIsFriendOfPhineasAndFerb.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then that Human is friend of Candace 
        //  and Candace is friend of that Human
        //  and Human is friend of Perry the Platypus owned by Phineas and Ferb and Candace
        //  and Human is friendly
        const friendOfCandaceAndPerryConclusion: ConceptualGraph = new ConceptualGraph();
        friendOfCandaceAndPerryConclusion.addConcept(someHuman);
        friendOfCandaceAndPerryConclusion.addConcept(phineas);
        friendOfCandaceAndPerryConclusion.addConcept(ferb);
        const candace: Concept = friendOfCandaceAndPerryConclusion.createConcept("Candace", "Girl", "Candace");
        const perry: Concept = friendOfCandaceAndPerryConclusion.createConcept("PerryThePlatypus", "Platypus", "Perry");
        const friendly: Concept = friendOfCandaceAndPerryConclusion.createConcept("Friendly", "Property", "Friendly");
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-candace", "FriendOf", [someHuman, candace]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-friendOf-human", "FriendOf", [candace, someHuman]);
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-perry", "FriendOf", [someHuman, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("phineas-ownsPet-perry", "OwnsPet", [phineas, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("ferb-ownsPet-perry", "OwnsPet", [ferb, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-ownsPet-perry", "OwnsPet", [candace, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("human-attr-friendly", "Attribute", [someHuman, friendly]);
        ifHumanIsFriendOfPhineasAndFerb.conclusion = friendOfCandaceAndPerryConclusion;

        // Create Phineas and Ferb Friends Conceptual Graph
        const phineasFerbAndFriendsCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasFerbAndFriendsCG();

        // Apply Rule
        const insertedFriendsCG: ConceptualGraph = ifHumanIsFriendOfPhineasAndFerb.applyRule(phineasFerbAndFriendsCG);

        // Inserted graph must still have all nodes of previous graph
        expect(doesConceptualGraphAContainAllNodesOfConceptualGraphB(
            phineasFerbAndFriendsCG,
            insertedFriendsCG
        )).toBe(true);
    })

    it('Concepts with the same Concept Types are identified via label', () => {
        // RUle: If Baljeet is friends with Phineas and Ferb
        //  then Phineas is sibling of Ferb
        //  and Ferb is friendly
        // Create Rule: If Human A is friends with Human B and Human C, 
        //  then Human B is sibling of Human C 
        //  and Human C is friendly
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanAIsFriendsWithHumanBAndC: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: If Human A is friends with Human B and Human C
        const humanFriendsOfHumansHypothesis: ConceptualGraph = new ConceptualGraph();
        const someHumanA: Concept = humanFriendsOfHumansHypothesis.createConcept("SomeHumanA", "Human", DesignatorType.LAMBDA);
        const someHumanB: Concept = humanFriendsOfHumansHypothesis.createConcept("SomeHumanB", "Human", DesignatorType.LAMBDA);
        const someHumanC: Concept = humanFriendsOfHumansHypothesis.createConcept("SomeHumanC", "Human", DesignatorType.LAMBDA);
        humanFriendsOfHumansHypothesis.createRelation("humana-friendof-humanb", "FriendOf", [someHumanA, someHumanB]);
        humanFriendsOfHumansHypothesis.createRelation("humana-friendof-humanC", "FriendOf", [someHumanA, someHumanC]);
        ifHumanAIsFriendsWithHumanBAndC.hypothesis = humanFriendsOfHumansHypothesis;

        // Create Conclusion: then Human B is sibling of Human C 
        //  and Human C is friendly
        const siblingAndFriendlyConclusion: ConceptualGraph = new ConceptualGraph();
        siblingAndFriendlyConclusion.addConcept(someHumanB);
        siblingAndFriendlyConclusion.addConcept(someHumanC);
        const friendly: Concept = siblingAndFriendlyConclusion.createConcept("Friendly", "Property");
        siblingAndFriendlyConclusion.createRelation("humanb-siblingof-humanc", "SiblingOf", [someHumanB, someHumanC]);
        siblingAndFriendlyConclusion.createRelation("humanc-attr-friendly", "Attribute", [someHumanC, friendly]);
        ifHumanAIsFriendsWithHumanBAndC.conclusion = siblingAndFriendlyConclusion;

        // Create Phineas and Candace Conceptual Graph
        const phineasAndCandaceCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getBaljeetFriendsOfPhineasAndFerbCG();

        // Apply Rule
        const insertedBaljeetCG: ConceptualGraph = ifHumanAIsFriendsWithHumanBAndC.applyRule(phineasAndCandaceCG);

        // Expect Phineas to be sibling of Ferb
        expect(insertedBaljeetCG.getRelationByLabel("Phineas-SiblingOf-Ferb")).toEqual({
            id: undefined,
            label: "Phineas-SiblingOf-Ferb",
            relationTypeLabels: ["SiblingOf"],
            conceptArgumentLabels: ["Phineas", "Ferb"]
        });

        // Expect Ferb to be sibling of Phineas
        expect(insertedBaljeetCG.getRelationByLabel("Ferb-SiblingOf-Phineas")).toEqual({
            id: undefined,
            label: "Ferb-SiblingOf-Phineas",
            relationTypeLabels: ["SiblingOf"],
            conceptArgumentLabels: ["Ferb", "Phineas"]
        });

        // Expect Phineas to be friendly
        expect(insertedBaljeetCG.getRelationByLabel("Phineas-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Phineas-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Phineas", "Friendly"]
        });

        // Expect Ferb to be friendly
        expect(insertedBaljeetCG.getRelationByLabel("Ferb-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Ferb-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Ferb", "Friendly"]
        });

    })

    it('If a concept or relation already exists, do not create a new one', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: if boy is brother of girl
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someBoy: Concept = boyBroOfGirlHypothesis.createConcept("SomeBoy", "Boy", DesignatorType.LAMBDA);
        const someGirl: Concept = boyBroOfGirlHypothesis.createConcept("SomeGirl", "Girl", DesignatorType.LAMBDA);
        boyBroOfGirlHypothesis.createRelation("someboy-broof-somegirl", "BrotherOf", [someBoy, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then Ferb is brother of girl
        const girlBroOfBoyConclusion: ConceptualGraph = new ConceptualGraph();
        girlBroOfBoyConclusion.addConcept(someGirl);
        girlBroOfBoyConclusion.addConcept(testScenarioProvider_PhineasAndFerb.ferb);
        girlBroOfBoyConclusion.createRelation("ferb-broof-somegirl", "BrotherOf", [testScenarioProvider_PhineasAndFerb.ferb, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.conclusion = girlBroOfBoyConclusion;

        // Create Phineas and Candace Conceptual Graph WITH Conclusion Already In Place
        const phineasAndCandaceCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasAndCandaceCG();
        phineasAndCandaceCG.addConcept(testScenarioProvider_PhineasAndFerb.ferb);
        phineasAndCandaceCG.createRelation("Ferb-BrotherOf-Candace", "BrotherOf", [testScenarioProvider_PhineasAndFerb.ferb, testScenarioProvider_PhineasAndFerb.candace])

        // Apply Rule
        const insertedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(phineasAndCandaceCG);

        // Expect there to be two brother relations
        expect(insertedPhineasAndCandaceCG.relations.length).toBe(2);
        expect(insertedPhineasAndCandaceCG.relations[0]).toEqual({
            ...relationDao.getRelationByLabel("phineas-broOf-candace"),
            id: undefined,
        });
        expect(insertedPhineasAndCandaceCG.relations[1]).toEqual({
            id: undefined,
            label: "Ferb-BrotherOf-Candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Ferb", "Candace"]
        });

        // Expect ferb to have been added
        expect(insertedPhineasAndCandaceCG.concepts.length).toBe(3);
        expect(insertedPhineasAndCandaceCG.concepts[0]).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(insertedPhineasAndCandaceCG.concepts[1]).toEqual(testScenarioProvider_PhineasAndFerb.candace);
        expect(insertedPhineasAndCandaceCG.concepts[2]).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
    })

    it('Must create a copy and not adjust the original', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: if boy is brother of girl
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someBoy: Concept = boyBroOfGirlHypothesis.createConcept("SomeBoy", "Boy", DesignatorType.LAMBDA);
        const someGirl: Concept = boyBroOfGirlHypothesis.createConcept("SomeGirl", "Girl", DesignatorType.LAMBDA);
        boyBroOfGirlHypothesis.createRelation("someboy-broof-somegirl", "BrotherOf", [someBoy, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then Ferb is brother of girl
        const girlBroOfBoyConclusion: ConceptualGraph = new ConceptualGraph();
        girlBroOfBoyConclusion.addConcept(someGirl);
        girlBroOfBoyConclusion.addConcept(testScenarioProvider_PhineasAndFerb.ferb);
        girlBroOfBoyConclusion.createRelation("ferb-broof-somegirl", "BrotherOf", [testScenarioProvider_PhineasAndFerb.ferb, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.conclusion = girlBroOfBoyConclusion;

        // Create Phineas and Candace Conceptual Graph
        const originalPhineasAndCandaceCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasAndCandaceCG();
        const clonePhineasAndCandaceCG: ConceptualGraph = originalPhineasAndCandaceCG.clone();

        // Apply Rule
        const insertedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(originalPhineasAndCandaceCG);

        // Expect original to be the same
        expect(originalPhineasAndCandaceCG).toEqual(clonePhineasAndCandaceCG);
        expect(originalPhineasAndCandaceCG).not.toEqual(insertedPhineasAndCandaceCG);

        // Expect addition of concept to inserted graph not to reflect in original graph
        insertedPhineasAndCandaceCG.createConcept("ShouldNotBeInOriginal", "Unwanted");
        expect(originalPhineasAndCandaceCG.getConceptByLabel("ShouldNotBeInOriginal")).toBeUndefined();
    })

    it('When no matches for hypothesis, return a copy of the original graph', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new InsertionRule(queryManager);

        // Create Hypothesis: if boy is brother of girl
        const boyBroOfGirlHypothesis: ConceptualGraph = new ConceptualGraph();
        const someBoy: Concept = boyBroOfGirlHypothesis.createConcept("SomeBoy", "Boy", DesignatorType.LAMBDA);
        const someGirl: Concept = boyBroOfGirlHypothesis.createConcept("SomeGirl", "Girl", DesignatorType.LAMBDA);
        boyBroOfGirlHypothesis.createRelation("someboy-broof-somegirl", "BrotherOf", [someBoy, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.hypothesis = boyBroOfGirlHypothesis;

        // Create Conclusion: then Ferb is brother of girl
        const girlBroOfBoyConclusion: ConceptualGraph = new ConceptualGraph();
        girlBroOfBoyConclusion.addConcept(someGirl);
        girlBroOfBoyConclusion.addConcept(testScenarioProvider_PhineasAndFerb.ferb);
        girlBroOfBoyConclusion.createRelation("ferb-broof-somegirl", "BrotherOf", [testScenarioProvider_PhineasAndFerb.ferb, someGirl]);
        ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.conclusion = girlBroOfBoyConclusion;

        // Create jerry is brown
        const jerryIsBrownCG: ConceptualGraph = testScenarioProvider_JerryTheMouse.getConcept_jerryTheMouseIsColourBrown(testId);

        // Apply Rule
        const insertedJerryIsBrownCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(jerryIsBrownCG);

        // Expect original to be the same as inserted
        expect(jerryIsBrownCG).toEqual(insertedJerryIsBrownCG);
        
    })

})
