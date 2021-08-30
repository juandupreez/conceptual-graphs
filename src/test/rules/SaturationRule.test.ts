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
            ...relationDao.getRelationByLabel("phineas-broOf-candace"),
            id: undefined,
        });
        expect(saturatedPhineasAndCandaceCG.relations[1]).toEqual({
            id: undefined,
            label: "somegirl-sisof-someboy",
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
            label: "ferb-broof-somegirl",
            relationTypeLabels: ["BrotherOf"],
            conceptArgumentLabels: ["Ferb", "Candace"]
        });

        // Expect ferb to have been added
        expect(saturatedPhineasAndCandaceCG.concepts.length).toBe(3);
        expect(saturatedPhineasAndCandaceCG.concepts[0]).toEqual(testScenarioProvider_PhineasAndFerb.phineas);
        expect(saturatedPhineasAndCandaceCG.concepts[1]).toEqual(testScenarioProvider_PhineasAndFerb.candace);
        expect(saturatedPhineasAndCandaceCG.concepts[2]).toEqual(testScenarioProvider_PhineasAndFerb.ferb);

    })

})