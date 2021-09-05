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
import { ConceptualGraphQueryManager } from "../../main/query/ConceptualGraphQueryManager";
import { QueryManager } from "../../main/query/QueryManager";
import { Rule } from "../../main/rules/Rule";
import { SaturationRule } from "../../main/rules/SaturationRule";
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

describe('Simple saturation', () => {

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
        const ifBoyBroOfGirlThenGirlSisOfBoyRule: Rule = new SaturationRule(queryManager);

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
        const saturatedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenGirlSisOfBoyRule.applyRule(phineasAndCandaceCG);

        // Expect there to be a sister of relation
        expect(saturatedPhineasAndCandaceCG.relations.length).toBe(2);
        expect(saturatedPhineasAndCandaceCG.relations[0]).toEqual({
            label: "phineas-broOf-candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Phineas", "Candace"],
            id: undefined,
        });
        expect(saturatedPhineasAndCandaceCG.relations[1]).toEqual({
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
        const ifBoyBroOfGirlThenOtherBoyBroOfGirlRule: Rule = new SaturationRule(queryManager);

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
        const saturatedPhineasAndCandaceCG: ConceptualGraph = ifBoyBroOfGirlThenOtherBoyBroOfGirlRule.applyRule(phineasAndCandaceCG);

        // Expect there to be two brother relations
        expect(saturatedPhineasAndCandaceCG.relations.length).toBe(2);
        expect(saturatedPhineasAndCandaceCG.relations[0]).toEqual({
            ...relationDao.getRelationByLabel("phineas-broOf-candace"),
            id: undefined,
        });
        expect(saturatedPhineasAndCandaceCG.relations[1]).toEqual({
            id: undefined,
            label: "Ferb-BrotherOf-Candace",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Ferb", "Candace"]
        });

        // Expect ferb to have been added
        expect(saturatedPhineasAndCandaceCG.concepts.length).toBe(3);
        expect(saturatedPhineasAndCandaceCG.concepts[0]).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(saturatedPhineasAndCandaceCG.concepts[1]).toEqual(testScenarioProvider_PhineasAndFerb.candace);
        expect(saturatedPhineasAndCandaceCG.concepts[2]).toEqual(testScenarioProvider_PhineasAndFerb.ferb);

    })

    it('Add several new concepts and relations', () => {
        // Rule: If Human is friend of Phineas and friend of Ferb, 
        //  then that Human is friend of Candace 
        //      and Candace is friend of that Human
        //      and Human is Friend of Perry the Platypus owned by Phineas and Ferb and Candace
        //      and that Human is friendly
        const queryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
        const ifHumanIsFriendOfPhineasAndFerb: Rule = new SaturationRule(queryManager);

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
        const saturatedFriendsCG: ConceptualGraph = ifHumanIsFriendOfPhineasAndFerb.applyRule(phineasFerbAndFriendsCG);
        
        // console.log("\n\nSaturated Graph:\n----------------\n" + saturatedFriendsCG.toString());

        // Expect baljeet/buford/isabella to be friends of candace
        expect(saturatedFriendsCG.getRelationByLabel("Baljeet-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "Candace"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Buford-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "Candace"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Isabella-FriendOf-Candace")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-Candace",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "Candace"]
        } as Relation);

        // Expect candace to be friends of baljeet/buford/isabella
        expect(saturatedFriendsCG.getRelationByLabel("Candace-FriendOf-Baljeet")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Baljeet",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Baljeet"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Candace-FriendOf-Buford")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Buford",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Buford"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Candace-FriendOf-Isabella")).toEqual({
            id: undefined,
            label: "Candace-FriendOf-Isabella",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Candace", "Isabella"]
        } as Relation);

        // Expect baljeet/buford/isabella to be friends of perry
        expect(saturatedFriendsCG.getRelationByLabel("Baljeet-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Baljeet-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Baljeet", "PerryThePlatypus"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Buford-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Buford-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Buford", "PerryThePlatypus"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Isabella-FriendOf-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Isabella-FriendOf-PerryThePlatypus",
            relationTypeLabels: ["FriendOf"],
            conceptArgumentLabels: ["Isabella", "PerryThePlatypus"]
        } as Relation);

        // Expect perry to be pet of phineas/ferb/candace
        expect(saturatedFriendsCG.getRelationByLabel("Phineas-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Phineas-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Phineas", "PerryThePlatypus"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Ferb-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Ferb-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Ferb", "PerryThePlatypus"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Candace-OwnsPet-PerryThePlatypus")).toEqual({
            id: undefined,
            label: "Candace-OwnsPet-PerryThePlatypus",
            relationTypeLabels: ["OwnsPet"],
            conceptArgumentLabels: ["Candace", "PerryThePlatypus"]
        } as Relation);

        // Expect baljeet/buford/isabella to be friendly
        expect(saturatedFriendsCG.getRelationByLabel("Baljeet-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Baljeet-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Baljeet", "Friendly"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Buford-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Buford-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Buford", "Friendly"]
        } as Relation);
        expect(saturatedFriendsCG.getRelationByLabel("Isabella-Attribute-Friendly")).toEqual({
            id: undefined,
            label: "Isabella-Attribute-Friendly",
            relationTypeLabels: ["Attribute"],
            conceptArgumentLabels: ["Isabella", "Friendly"]
        } as Relation);

    })

})