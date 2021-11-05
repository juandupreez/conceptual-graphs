import { Concept, ConceptDao, ConceptTypeDao, ConceptualGraph, ConceptualGraphQueryManager, DatabaseQueryManager, DesignatorType, FactDao, InMemoryConceptDao, InMemoryConceptTypeDao, InMemoryFactDao, InMemoryRelationDao, InMemoryRelationTypeDao, RelationDao, RelationTypeDao } from '../../main/conceptual-graphs';
import { KBQueryInsertionOperation } from '../../main/operations/KBQueryInsertionOperation';
import { IdGenerator } from '../../main/util/IdGenerator';
import { TestScenarioProvider_PhineasAndFerb } from '../testutil/TestScenarioProvider_PhineasAndFerb';
import { TestScenarioProvider_TomAndJerry } from '../testutil/TestScenarioProvider_TomAndJerry';

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: FactDao = new InMemoryFactDao(conceptDao, relationDao);
const testScenarioProvider_JerryTheMouse: TestScenarioProvider_TomAndJerry = new TestScenarioProvider_TomAndJerry(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);
const testScenarioProvider_PhineasAndFerb: TestScenarioProvider_PhineasAndFerb = new TestScenarioProvider_PhineasAndFerb(conceptDao, relationDao, conceptTypeDao, relationTypeDao, conceptualGraphDao);

const cgQueryManager: ConceptualGraphQueryManager = new ConceptualGraphQueryManager(conceptTypeDao, relationTypeDao);
const dbQueryManager: DatabaseQueryManager = new DatabaseQueryManager(conceptDao, relationDao);

let testId: string = "";

describe('KBQueryInsertionOperation', () => {

    beforeAll(() => {
        testScenarioProvider_PhineasAndFerb.createPhineasAndFerbStructure();
    })

    beforeEach(() => {
        testId = IdGenerator.getInstance().getNextUniquTestId();
        global.console = require('console');
    })

    it('should use conclusion to query the knowledge base for a conceptual graph that matches the hypothesis', () => {
        const queryDbOperation: KBQueryInsertionOperation = new KBQueryInsertionOperation(cgQueryManager, dbQueryManager);

        // Hypothesis: Any boy
        const anyBoyHypothesis: ConceptualGraph = new ConceptualGraph();
        const anyBoyConcept: Concept = anyBoyHypothesis.createConcept("AnyBoy", "Boy", DesignatorType.LAMBDA);
        queryDbOperation.hypothesis = anyBoyHypothesis;

        // Conclusion to be used as query: The sisters of that specific boy
        const sisterOfBoyQueryConclusion: ConceptualGraph = new ConceptualGraph();
        const whichGirlConcept: Concept = sisterOfBoyQueryConclusion.createConcept("WhichGirl", "Girl", DesignatorType.LAMBDA);
        sisterOfBoyQueryConclusion.addConcept(anyBoyConcept);
        sisterOfBoyQueryConclusion.createRelation("whichgirl-sisterof-anyboy", "SisterOf", [whichGirlConcept, anyBoyConcept]);
        queryDbOperation.conclusion = sisterOfBoyQueryConclusion;

        // CG to run operation on: Phineas
        const phineasCG: ConceptualGraph = new ConceptualGraph();
        phineasCG.addConcept(testScenarioProvider_PhineasAndFerb.phineas);

        // Run the operation
        const appliedConceptualGraph: ConceptualGraph = queryDbOperation.applyOperation(phineasCG);

        // Phineas should have sister Candace as specified in the facts knowledge base
        expect(appliedConceptualGraph.getConceptByLabel("Candace")).toEqual(testScenarioProvider_PhineasAndFerb.candace);
    })

})