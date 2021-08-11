import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao, SimpleConceptType } from "../../main/dao/ConceptTypeDao";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Concept, DesignatorType, QuantifierType } from "../../main/domain/Concept";
import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";
import { RelationDao } from "../../main/dao/RelationDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { InMemoryConceptualGraphDao } from "../../main/dao/inmemory/InMemoryConceptualGraphDao";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: ConceptualGraphDao = new InMemoryConceptualGraphDao(conceptDao, relationDao);

describe('Example ', () => {

    beforeAll(() => {
        const conceptTypeHierarchy: SimpleConceptType[] = [{
            label: "Entity",
            subConceptTypes: [
                { label: "Graph" },
                { label: "Conceptual" },
                { label: "Say" },
                { label: "Phrase" },
                { label: "God" },
                { label: "Bird" },
                { label: "SycamoreTree" },
                { label: "Fat" },
                { label: "Sing" },
                { label: "Person" },
                { label: "Go" },
                { label: "City" },
                { label: "Cat" },
                { label: "Mat" },
                { label: "Book" },
                { label: "Table" },
                { label: "Bus" },
                { label: "Situation" },
            ]
        }]
        conceptTypeDao.importHierarchyFromSimpleConceptTypes(conceptTypeHierarchy);

        const relationTypeHierarchy: SimpleRelationType[] = [{
            label: "LinkOne",
            signature: ["Entity"],
            subRelationTypes: [{
                label: "Past",
                signature: ["Situation"]
            }, {
                label: "PossibleSituation",
                signature: ["Situation"]
            }]
        }, {
            label: "LinkTwo",
            signature: ["Entity", "Entity"],
            subRelationTypes: [{
                label: "Attribute",
                signature: ["Entity", "Entity"]
            }, {
                label: "Theme",
                signature: ["Entity", "Entity"]
            }, {
                label: "In",
                signature: ["Entity", "Entity"]
            }, {
                label: "On",
                signature: ["Entity", "Entity"]
            }, {
                label: "Agent",
                signature: ["Entity", "Entity"]
            }, {
                label: "Destination",
                signature: ["Entity", "Entity"]
            }]
        },
        {
            label: "LinkThree",
            signature: ["Entity", "Entity", "Entity"],
            subRelationTypes: [{
                label: "Between",
                signature: ["Entity", "Entity", "Entity"]
            }]
        }
        ]
        relationTypeDao.importHierarchyFromSimpleRelationTypes(relationTypeHierarchy);
    })

    it('Conceptual graphs', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const graphConcept: Concept = conceptualGraph.createConcept("Graphs", "Graph", {
            quantifierType: QuantifierType.SOME,
            designatorType: DesignatorType.BLANK
        });
        const conceptualConcept: Concept = conceptualGraph.createConcept("Conceptual", "Conceptual");
        conceptualGraph.createRelation("graph-attr-conceptual", "Attribute", [graphConcept, conceptualConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('Say "Nightie-night"', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const sayConcept: Concept = conceptualGraph.createConcept("Say", "Say", "");
        const phraseConcept: Concept = conceptualGraph.createConcept("NightyNightPhrase", "Phrase", "Nighty-night");
        conceptualGraph.createRelation("say-theme-phrase", "Theme", [sayConcept, phraseConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('God', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const godConcept: Concept = conceptualGraph.createConcept("God", "God");

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('There is a bird in a sycamore tree', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBirdConcept: Concept = conceptualGraph.createConcept("ABird", "Bird");
        const aSycamoreTreeConcept: Concept = conceptualGraph.createConcept("ASycamoreTree", "SycamoreTree");
        conceptualGraph.createRelation("abird-in-sycamoretree", "In", [aBirdConcept, aSycamoreTreeConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('A cat is on a mat', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aCatConcept: Concept = conceptualGraph.createConcept("ACat", "Cat");
        const aMatConcept: Concept = conceptualGraph.createConcept("AMat", "Mat");
        conceptualGraph.createRelation("acat-on-ammat", "On", [aCatConcept, aMatConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('A cat is fat', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aCatConcept: Concept = conceptualGraph.createConcept("AnotherCat", "Cat");
        const fatConcept: Concept = conceptualGraph.createConcept("Fat", "Fat");
        conceptualGraph.createRelation("acat-attr-fat", "Attribute", [aCatConcept, fatConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('A bird is singing', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBirdConcept: Concept = conceptualGraph.createConcept("AnotherBird", "Bird");
        const singConcept: Concept = conceptualGraph.createConcept("Sing", "Sing");
        conceptualGraph.createRelation("abird-agnt-sing", "Agent", [aBirdConcept, singConcept]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('John is going to Aalborg', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const john: Concept = conceptualGraph.createConcept("JohnPerson", "Person", "John");
        const going: Concept = conceptualGraph.createConcept("isGoing", "Go");
        conceptualGraph.createRelation("john-agnt-go", "Agent", [john, going]);

        const aalborg: Concept = conceptualGraph.createConcept("AalborgCity", "City", "Aalborg");
        conceptualGraph.createRelation("go-dest-city", "Destination", [going, aalborg]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('A book is on a table', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBook: Concept = conceptualGraph.createConcept("ABook", "Book");
        const aTable: Concept = conceptualGraph.createConcept("ATable", "Table");
        conceptualGraph.createRelation("abook-on-atable", "Agent", [aBook, aTable]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('There exists a person whose name is John', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const john: Concept = conceptualGraph.createConcept("JohnPerson2", "Person", {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.LITERAL,
            designatorValue: "John"
        });

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('There exists a bus', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBush: Concept = conceptualGraph.createConcept("ABus", "Bus", {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.BLANK
        });

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('Julia is between Tom and Brad', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const julia: Concept = conceptualGraph.createConcept("JuliaPerson", "Person", "Julia");
        const tom: Concept = conceptualGraph.createConcept("TomPerson", "Person", "Tom");
        const brad: Concept = conceptualGraph.createConcept("BradPerson", "Person", "Brad");

        const juliaBetweenTomAndBradRelation: Relation = conceptualGraph.createRelation("julia-between-tom-and-brad", "Between", [julia, tom, brad]);

        conceptualGraphDao.createConceptualGraph(conceptualGraph);
    })

    it('In the past, there was this situation: A bird was singing', () => {
        const birdSingingConceptualGraph: ConceptualGraph = new ConceptualGraph();
        birdSingingConceptualGraph.label = "a bird is singing";
        const aBird: Concept = birdSingingConceptualGraph.createConcept("aBird2", "Bird");
        const sing: Concept = birdSingingConceptualGraph.createConcept("sing2", "Sing");
        const birdIsSingingRelation: Relation = birdSingingConceptualGraph.createRelation("bird-is-singing", "Agent", [aBird, sing]);
        conceptualGraphDao.createConceptualGraph(birdSingingConceptualGraph);

        const birdSangConceptualGraph: ConceptualGraph = new ConceptualGraph;
        const situationConcept: Concept = birdSangConceptualGraph.createConcept("ABirdSang", "Situation", {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.CONCEPTUAL_GRAPH_LABEL,
            designatorValue: birdSingingConceptualGraph.label
        })
        birdSangConceptualGraph.createRelation("abird-sang", "Past", [situationConcept]);
    })

    it('It is possible that a bird is singing', () => {
        const birdSingingConceptualGraph: ConceptualGraph = new ConceptualGraph();
        birdSingingConceptualGraph.label = "a bird is singing again";
        const aBird: Concept = birdSingingConceptualGraph.createConcept("aBird3", "Bird");
        const sing: Concept = birdSingingConceptualGraph.createConcept("sing3", "Sing");
        const birdIsSingingRelation: Relation = birdSingingConceptualGraph.createRelation("bird-is-singing-again", "Agent", [aBird, sing]);
        conceptualGraphDao.createConceptualGraph(birdSingingConceptualGraph);

        const birdSangConceptualGraph: ConceptualGraph = new ConceptualGraph;
        const situationConcept: Concept = birdSangConceptualGraph.createConcept("ABirdCouldBeSinging", "Situation", {
            quantifierType: QuantifierType.A_SINGLE,
            designatorType: DesignatorType.CONCEPTUAL_GRAPH_LABEL,
            designatorValue: birdSingingConceptualGraph.label
        })
        birdSangConceptualGraph.createRelation("abird-could-be-singing", "PossibleSituation", [situationConcept]);
    })

})