import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryConceptDao } from "../../main/dao/inmemory/InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "../../main/dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";
import { Concept, DesignatorType } from "../../main/domain/Concept";
import { ConceptType, SimpleConceptType } from "../../main/domain/ConceptType";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType, SimpleRelationType } from "../../main/domain/RelationType";
import { RelationDao } from "../../main/dao/RelationDao";
import { InMemoryRelationDao } from "../../main/dao/inmemory/InMemoryRelationDao";
import { FactDao, InMemoryFactDao } from "../../main/conceptual-graphs";

const conceptTypeDao: ConceptTypeDao = new InMemoryConceptTypeDao();
const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao(conceptTypeDao);
const conceptDao: ConceptDao = new InMemoryConceptDao(conceptTypeDao);
const relationDao: RelationDao = new InMemoryRelationDao(conceptDao, conceptTypeDao, relationTypeDao);
const conceptualGraphDao: FactDao = new InMemoryFactDao(conceptDao, relationDao);

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
                { label: "Mouse" },
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

    beforeEach(() => {
        global.console = require('console');
    })

    it('Conceptual graphs', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const graphConcept: Concept = conceptualGraph.createConcept("Graphs", "Graph", {
            designatorType: DesignatorType.BLANK
        });
        const conceptualConcept: Concept = conceptualGraph.createConcept("Conceptual", "Conceptual");
        conceptualGraph.createRelation("graph-attr-conceptual", "Attribute", [graphConcept, conceptualConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('Say "Nightie-night"', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const sayConcept: Concept = conceptualGraph.createConcept("Say", "Say", "");
        const phraseConcept: Concept = conceptualGraph.createConcept("NightyNightPhrase", "Phrase", "Nighty-night");
        conceptualGraph.createRelation("say-theme-phrase", "Theme", [sayConcept, phraseConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('God', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const godConcept: Concept = conceptualGraph.createConcept("God", "God");

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('There is a bird in a sycamore tree', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aMouseConcept: Concept = conceptualGraph.createConcept("AMouse", "Mouse");
        const aSycamoreTreeConcept: Concept = conceptualGraph.createConcept("ASycamoreTree", "SycamoreTree");
        conceptualGraph.createRelation("abird-in-sycamoretree", "In", [aMouseConcept, aSycamoreTreeConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('A cat is on a mat', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aCatConcept: Concept = conceptualGraph.createConcept("ACat", "Cat");
        const aMatConcept: Concept = conceptualGraph.createConcept("AMat", "Mat");
        conceptualGraph.createRelation("acat-on-ammat", "On", [aCatConcept, aMatConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('A cat is fat', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aCatConcept: Concept = conceptualGraph.createConcept("AnotherCat", "Cat");
        const fatConcept: Concept = conceptualGraph.createConcept("Fat", "Fat");
        conceptualGraph.createRelation("acat-attr-fat", "Attribute", [aCatConcept, fatConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('A bird is singing', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aMouseConcept: Concept = conceptualGraph.createConcept("AnotherMouse", "Mouse");
        const singConcept: Concept = conceptualGraph.createConcept("Sing", "Sing");
        conceptualGraph.createRelation("abird-agnt-sing", "Agent", [aMouseConcept, singConcept]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('John is going to Aalborg', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const john: Concept = conceptualGraph.createConcept("JohnPerson", "Person", "John");
        const going: Concept = conceptualGraph.createConcept("isGoing", "Go");
        conceptualGraph.createRelation("john-agnt-go", "Agent", [john, going]);

        const aalborg: Concept = conceptualGraph.createConcept("AalborgCity", "City", "Aalborg");
        conceptualGraph.createRelation("go-dest-city", "Destination", [going, aalborg]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('A book is on a table', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBook: Concept = conceptualGraph.createConcept("ABook", "Book");
        const aTable: Concept = conceptualGraph.createConcept("ATable", "Table");
        conceptualGraph.createRelation("abook-on-atable", "Agent", [aBook, aTable]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('There exists a person whose name is John', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const john: Concept = conceptualGraph.createConcept("JohnPerson2", "Person", {
            designatorType: DesignatorType.LITERAL,
            designatorValue: "John"
        });

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('There exists a bus', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const aBush: Concept = conceptualGraph.createConcept("ABus", "Bus", {
            designatorType: DesignatorType.BLANK
        });

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('Julia is between Tom and Brad', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const julia: Concept = conceptualGraph.createConcept("JuliaPerson", "Person", "Julia");
        const tom: Concept = conceptualGraph.createConcept("TomPerson", "Person", "Tom");
        const brad: Concept = conceptualGraph.createConcept("BradPerson", "Person", "Brad");

        const juliaBetweenTomAndBradRelation: Relation = conceptualGraph.createRelation("julia-between-tom-and-brad", "Between", [julia, tom, brad]);

        conceptualGraphDao.createFact(conceptualGraph);
        // console.log(conceptualGraph.toString());
    })

    it('In the past, there was this situation: A bird was singing', () => {
        const birdSingingConceptualGraph: ConceptualGraph = new ConceptualGraph();
        birdSingingConceptualGraph.label = "a bird is singing";
        const aMouse: Concept = birdSingingConceptualGraph.createConcept("aMouse2", "Mouse");
        const sing: Concept = birdSingingConceptualGraph.createConcept("sing2", "Sing");
        const birdIsSingingRelation: Relation = birdSingingConceptualGraph.createRelation("bird-is-singing", "Agent", [aMouse, sing]);
        conceptualGraphDao.createFact(birdSingingConceptualGraph);

        const birdSangConceptualGraph: ConceptualGraph = new ConceptualGraph;
        const situationConcept: Concept = birdSangConceptualGraph.createConcept("AMouseSang", "Situation", {
            designatorType: DesignatorType.CONCEPTUAL_GRAPH_LABEL,
            designatorValue: birdSingingConceptualGraph.label
        })
        birdSangConceptualGraph.createRelation("abird-sang", "Past", [situationConcept]);
        // console.log(birdSangConceptualGraph.toString());
    })

    it('It is possible that a bird is singing', () => {
        const birdSingingConceptualGraph: ConceptualGraph = new ConceptualGraph();
        birdSingingConceptualGraph.label = "a bird is singing again";
        const aMouse: Concept = birdSingingConceptualGraph.createConcept("aMouse3", "Mouse");
        const sing: Concept = birdSingingConceptualGraph.createConcept("sing3", "Sing");
        const birdIsSingingRelation: Relation = birdSingingConceptualGraph.createRelation("bird-is-singing-again", "Agent", [aMouse, sing]);
        conceptualGraphDao.createFact(birdSingingConceptualGraph);

        const birdSangConceptualGraph: ConceptualGraph = new ConceptualGraph;
        const situationConcept: Concept = birdSangConceptualGraph.createConcept("AMouseCouldBeSinging", "Situation", {
            designatorType: DesignatorType.CONCEPTUAL_GRAPH_LABEL,
            designatorValue: birdSingingConceptualGraph.label
        })
        birdSangConceptualGraph.createRelation("abird-could-be-singing", "PossibleSituation", [situationConcept]);
        // console.log(birdSingingConceptualGraph.toString());
    })

})