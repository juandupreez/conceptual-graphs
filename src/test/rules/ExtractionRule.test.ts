import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao"
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
import { ExtractionRule } from "../../main/rules/ExtractionRule";
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

describe('Simple extraction', () => {

    beforeAll(() => {
        testScenarioProvider_PhineasAndFerb.createPhineasAndFerbStructure();
    })

    beforeEach(() => {
        testId = IdGenerator.getInstance().getNextUniquTestId();
        global.console = require('console');
    })

    it('Extract a new single relation', () => {
        // Rule: If Phineas is brother of Candace, then Candace is sister of Phineas
        // Create rule: if boy is brother of girl then girl is sister of boy
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenGirlSisOfBoyRule: Rule = new ExtractionRule(queryManager);

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
        const extractedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenGirlSisOfBoyRule.applyRule(phineasAndCandaceCG);

        // Expect there to be ONLY a sister of relation
        expect(extractedPhineasAndCandaceCG.relations.length).toBe(1);
        expect(extractedPhineasAndCandaceCG.relations[0]).toEqual({
            id: undefined,
            label: "Candace-SisterOf-Phineas",
            relationTypeLabels: ["SisterOf"],
            conceptArgumentLabels: ["Candace", "Phineas"]
        });

    })

    it('Extract a new single relation and concept', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new ExtractionRule(queryManager);

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
        const extractedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(phineasAndCandaceCG);

        // Expect there to be ONLY ferb brother relations
        expect(extractedPhineasAndCandaceCG.relations.length).toBe(1);
        expect(extractedPhineasAndCandaceCG.relations[0]).toEqual({
            id: undefined,
            label: "Ferb-BrotherOf-Candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Ferb", "Candace"]
        });

        // Expect ferb to have been added And phineas to be taken away
        expect(extractedPhineasAndCandaceCG.concepts.length).toBe(2);
        expect(extractedPhineasAndCandaceCG.concepts[0]).toEqual(testScenarioProvider_PhineasAndFerb.candace);
        expect(extractedPhineasAndCandaceCG.concepts[1]).toEqual(testScenarioProvider_PhineasAndFerb.ferb);
        expect(extractedPhineasAndCandaceCG.getConceptByLabel("Phineas")).toBeUndefined();

    })

    it('Extract several new concepts and relations', () => {
        // Rule: If Human is friend of Phineas and friend of Ferb, 
        //  then that Human is friend of Candace 
        //      and Candace is friend of that Human
        //      and Human is Friend of Perry the Platypus owned by Phineas Candace (But not Ferb)
        //      and that Human is friendly
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanIsFriendOfPhineasAndFerb: Rule = new ExtractionRule(queryManager);

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
        //  and Human is friend of Perry the Platypus owned by Phineas and Candace (But not Ferb)
        //  and Human is friendly
        const friendOfCandaceAndPerryConclusion: ConceptualGraph = new ConceptualGraph();
        friendOfCandaceAndPerryConclusion.addConcept(someHuman);
        friendOfCandaceAndPerryConclusion.addConcept(phineas);
        const candace: Concept = friendOfCandaceAndPerryConclusion.createConcept("Candace", "Girl", "Candace");
        const perry: Concept = friendOfCandaceAndPerryConclusion.createConcept("PerryThePlatypus", "Platypus", "Perry");
        const friendly: Concept = friendOfCandaceAndPerryConclusion.createConcept("Friendly", "Property", "Friendly");
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-candace", "FriendOf", [someHuman, candace]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-friendOf-human", "FriendOf", [candace, someHuman]);
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-perry", "FriendOf", [someHuman, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("phineas-ownsPet-perry", "OwnsPet", [phineas, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-ownsPet-perry", "OwnsPet", [candace, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("human-attr-friendly", "Attribute", [someHuman, friendly]);
        ifHumanIsFriendOfPhineasAndFerb.conclusion = friendOfCandaceAndPerryConclusion;
        
        // Create Phineas and Ferb Friends Conceptual Graph
        const phineasFerbAndFriendsCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasFerbAndFriendsCG();

        // Apply Rule
        const extractedFriendsCG: ConceptualGraph = ifHumanIsFriendOfPhineasAndFerb.applyRule(phineasFerbAndFriendsCG);

        // Expect baljeet/buford/isabella to be friends of candace
        expect(extractedFriendsCG.getRelationByLabel("Baljeet-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "Candace"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Buford-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "Candace"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Isabella-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "Candace"]
        } as Relation);

        // Expect candace to be friends of baljeet/buford/isabella
        expect(extractedFriendsCG.getRelationByLabel("Candace-FriendOf-Baljeet")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Baljeet",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Baljeet"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Candace-FriendOf-Buford")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Buford",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Buford"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Candace-FriendOf-Isabella")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Isabella",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Isabella"]
        } as Relation);

        // Expect baljeet/buford/isabella to be friends of perry
        expect(extractedFriendsCG.getRelationByLabel("Baljeet-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "PerryThePlatypus"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Buford-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "PerryThePlatypus"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Isabella-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "PerryThePlatypus"]
        } as Relation);

        // Expect perry to be pet of phineas/candace
        expect(extractedFriendsCG.getRelationByLabel("Phineas-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Phineas-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Phineas", "PerryThePlatypus"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Candace-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Candace-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Candace", "PerryThePlatypus"]
        } as Relation);

        // Expect Ferb not to be in answer, as he was not in Conclusion
        expect(extractedFriendsCG.getRelationByLabel("Ferb-OwnsPet-PerryThePlatypus")).toBeUndefined();
        expect(extractedFriendsCG.getConceptByLabel("Ferb")).toBeUndefined();

        // Expect baljeet/buford/isabella to be friendly
        expect(extractedFriendsCG.getRelationByLabel("Baljeet-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Baljeet-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Baljeet", "Friendly"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Buford-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Buford-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Buford", "Friendly"]
        } as Relation);
        expect(extractedFriendsCG.getRelationByLabel("Isabella-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Isabella-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Isabella", "Friendly"]
        } as Relation);

    })

    it('Extracted graph should contain no nodes of the original graph unless they are in conclusion', () => {
        // Rule: If Human is friend of Phineas and friend of Ferb, 
        //  then that Human is friend of Candace 
        //      and Candace is friend of that Human
        //      and Human is Friend of Perry the Platypus owned by Candace
        //      and that Human is friendly
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanIsFriendOfPhineasAndFerb: Rule = new ExtractionRule(queryManager);

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
        //  and Human is friend of Perry the Platypus owned by Candace
        //  and Human is friendly
        const friendOfCandaceAndPerryConclusion: ConceptualGraph = new ConceptualGraph();
        friendOfCandaceAndPerryConclusion.addConcept(someHuman);
        const candace: Concept = friendOfCandaceAndPerryConclusion.createConcept("Candace", "Girl", "Candace");
        const perry: Concept = friendOfCandaceAndPerryConclusion.createConcept("PerryThePlatypus", "Platypus", "Perry");
        const friendly: Concept = friendOfCandaceAndPerryConclusion.createConcept("Friendly", "Property", "Friendly");
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-candace", "FriendOf", [someHuman, candace]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-friendOf-human", "FriendOf", [candace, someHuman]);
        friendOfCandaceAndPerryConclusion.createRelation("human-friendOf-perry", "FriendOf", [someHuman, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("candace-ownsPet-perry", "OwnsPet", [candace, perry]);
        friendOfCandaceAndPerryConclusion.createRelation("human-attr-friendly", "Attribute", [someHuman, friendly]);
        ifHumanIsFriendOfPhineasAndFerb.conclusion = friendOfCandaceAndPerryConclusion;

        // Create Phineas and Ferb Friends Conceptual Graph
        const phineasFerbAndFriendsCG: ConceptualGraph = testScenarioProvider_PhineasAndFerb.getPhineasFerbAndFriendsCG();

        // Apply Rule
        const extractedFriendsCG: ConceptualGraph = ifHumanIsFriendOfPhineasAndFerb.applyRule(phineasFerbAndFriendsCG);

        // Extracted graph must not be same as original
        expect(doesConceptualGraphAContainAllNodesOfConceptualGraphB(
            phineasFerbAndFriendsCG,
            extractedFriendsCG
        )).toBe(false);

        // Nodes which are in original but not in Rule's conclusion must not be in Extracted graph
        expect(extractedFriendsCG.getConceptByLabel("Phineas")).toBeUndefined();
        expect(extractedFriendsCG.getConceptByLabel("Ferb")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("baljeet-friendOf-phineas")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("baljeet-friendOf-ferb")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("buford-friendOf-phineas")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("buford-friendOf-ferb")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("isabella-friendOf-phineas")).toBeUndefined();
        expect(extractedFriendsCG.getRelationByLabel("isabella-friendOf-ferb")).toBeUndefined();
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
        const ifHumanAIsFriendsWithHumanBAndC: Rule = new ExtractionRule(queryManager);

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
        const extractedBaljeetCG: ConceptualGraph = ifHumanAIsFriendsWithHumanBAndC.applyRule(phineasAndCandaceCG);

        // Expect Phineas to be sibling of Ferb
        expect(extractedBaljeetCG.getRelationByLabel("Phineas-SiblingOf-Ferb")).toEqual({
            id: undefined,
            label: "Phineas-SiblingOf-Ferb",
            relationTypeLabels: ["SiblingOf"],
            conceptArgumentLabels: ["Phineas", "Ferb"]
        });

        // Expect Ferb to be sibling of Phineas
        expect(extractedBaljeetCG.getRelationByLabel("Ferb-SiblingOf-Phineas")).toEqual({
            id: undefined,
            label: "Ferb-SiblingOf-Phineas",
            relationTypeLabels: ["SiblingOf"],
            conceptArgumentLabels: ["Ferb", "Phineas"]
        });

        // Expect Phineas to be friendly
        expect(extractedBaljeetCG.getRelationByLabel("Phineas-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Phineas-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Phineas", "Friendly"]
        });

        // Expect Ferb to be friendly
        expect(extractedBaljeetCG.getRelationByLabel("Ferb-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Ferb-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Ferb", "Friendly"]
        });

    })

    it('Must create a copy and not adjust the original', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new ExtractionRule(queryManager);

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
        const extractedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(originalPhineasAndCandaceCG);

        // Expect original to be the same
        expect(originalPhineasAndCandaceCG).toEqual(clonePhineasAndCandaceCG);
        expect(originalPhineasAndCandaceCG).not.toEqual(extractedPhineasAndCandaceCG);

        // Expect addition of concept to extracted graph not to reflect in original graph
        extractedPhineasAndCandaceCG.createConcept("ShouldNotBeInOriginal", "Unwanted");
        expect(originalPhineasAndCandaceCG.getConceptByLabel("ShouldNotBeInOriginal")).toBeUndefined();
    })

    it('When no matches for hypothesis, return a an empty conceptual graph', () => {
        // Rule: If Phineas is brother of Candace, then Ferb is brother of Candace
        // Create rule: if boy is brother of girl then ferb is brother of girl
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new ExtractionRule(queryManager);

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
        const extractedJerryIsBrownCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(jerryIsBrownCG);

        // Expect original to be the same as extracted
        expect(extractedJerryIsBrownCG.concepts.length).toBe(0);
        expect(extractedJerryIsBrownCG.relations.length).toBe(0);
        
    })

})
