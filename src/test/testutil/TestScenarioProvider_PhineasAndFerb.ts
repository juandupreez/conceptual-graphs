import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";

export class TestScenarioProvider_PhineasAndFerb {
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    conceptualGraphDao: ConceptualGraphDao;

    phineas: Concept;
    ferb: Concept;
    candace: Concept;
    lawrence: Concept;
    lindana: Concept;
    ranjeet: Concept;
    beaufort: Concept;
    isabella: Concept;
    perryThePlatypus: Concept;
    pinkyTheChiuaua: Concept;
    doofenshmirts: Concept;



    constructor(conceptDao: ConceptDao, relationDao: RelationDao,
        conceptTypeDao: ConceptTypeDao, relationTypeDao: RelationTypeDao,
        conceptualtGraphDao: ConceptualGraphDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
        this.conceptTypeDao = conceptTypeDao;
        this.relationTypeDao = relationTypeDao;
        this.conceptualGraphDao = conceptualtGraphDao;
    }


    createPhineasAndFerbStructure() {
        this._createConceptTypes();
        this._createRelationTypes();
        this._createCharacters();
        this._createOtherConcepts();

        this._createFamilyRelations();
        this._createFriendRelations();
        this._createOtherRelations();
    }

    private _createConceptTypes() {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity",
            subConceptTypes: [
                {
                    label: "Human",
                    subConceptTypes: [
                        { label: "Man" },
                        { label: "Woman" },
                        { label: "Boy" },
                        { label: "Girl" },
                    ]
                },
                {
                    label: "Animal",
                    subConceptTypes: [
                        { label: "Platypus" },
                        {
                            label: "Dog",
                            subConceptTypes: [
                                { label: "Chiuaua" }
                            ]
                        },
                    ]
                }
            ]
        }]);
    }

    private _createRelationTypes() {
        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo",
            signature: ["Entity", "Entity"],
            subRelationTypes: [{
                label: "RelatedTo",
                signature: ["Human", "Human"],
                subRelationTypes: [
                    {
                        label: "SiblingOf",
                        signature: ["Human", "Human"],
                        subRelationTypes: [
                            {
                                label: "BrotherOf",
                                signature: ["Boy", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepBrotherOf",
                                        signature: ["Boy", "Human"]
                                    },
                                ]
                            },
                            {
                                label: "SisterOf",
                                signature: ["Girl", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepSisterOf",
                                        signature: ["Girl", "Human"]
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        label: "ParentOf",
                        signature: ["Human", "Human"],
                        subRelationTypes: [
                            {
                                label: "MotherOf",
                                signature: ["Woman", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepMotherOf",
                                        signature: ["Woman", "Human"]
                                    },
                                ]
                            },
                            {
                                label: "FatherOf",
                                signature: ["Man", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepFatherOf",
                                        signature: ["Man", "Human"]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        label: "ChildOf",
                        signature: ["Human", "Human"],
                        subRelationTypes: [
                            {
                                label: "SonOf",
                                signature: ["Human", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepSonOf",
                                        signature: ["Human", "Human"]
                                    }
                                ]
                            },
                            {
                                label: "DaughterOf",
                                signature: ["Human", "Human"],
                                subRelationTypes: [
                                    {
                                        label: "StepDaughterOf",
                                        signature: ["Human", "Human"]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }]
        }]);
    }

    private _createCharacters() {
        this.phineas = this.conceptDao.createConcept("Phineas", ["Boy"], "Phineas");
        this.ferb = this.conceptDao.createConcept("Ferb", ["Boy"], "Ferb");
        this.candace = this.conceptDao.createConcept("Candace", ["Girl"], "Candace");

        this.lawrence = this.conceptDao.createConcept("Lawrence", ["Man"], "Lawrence");
        this.lindana = this.conceptDao.createConcept("Lindana", ["Woman"], "Lindana");

        this.ranjeet = this.conceptDao.createConcept("Ranjeet", ["Boy"], "Ranjeet");
        this.beaufort = this.conceptDao.createConcept("Beaufort", ["Boy"], "Beaufort");
        this.isabella = this.conceptDao.createConcept("Isabella", ["Boy"], "Isabella");

        this.perryThePlatypus = this.conceptDao.createConcept("PerryThePlatypus", ["Platypus"], "Perry");
        this.pinkyTheChiuaua = this.conceptDao.createConcept("PinkyTheChiuaua", ["Chiuaua"], "Pinky");

        this.doofenshmirts = this.conceptDao.createConcept("Doofenshmirts", ["Man"], "Doofenshmirts");
    }

    private _createOtherConcepts() {
    }

    private _createFamilyRelations() {
        const fletcherFamily: ConceptualGraph = new ConceptualGraph();

        // Brothers and Sisters
        fletcherFamily.createRelation("phineas-stepBroOf-ferb", "StepBrotherOf", [this.phineas, this.ferb]);
        fletcherFamily.createRelation("ferb-stepBroOf-phineas", "StepBrotherOf", [this.ferb, this.phineas]);
        fletcherFamily.createRelation("candace-stepSisOf-ferb", "StepSisterOf", [this.candace, this.ferb]);
        fletcherFamily.createRelation("ferb-stepBroOf-candace", "StepBrotherOf", [this.ferb, this.candace]);
        fletcherFamily.createRelation("phineas-broOf-candace", "BrotherOf", [this.phineas, this.candace]);
        fletcherFamily.createRelation("candace-sisOf-phineas", "SisterOf", [this.candace, this.phineas]);

        // Mothers and Fathers
        fletcherFamily.createRelation("lindana-motherOf-phineas", "MotherOf", [this.lindana, this.phineas]);
        fletcherFamily.createRelation("phineas-sonOf-lindana", "SonOf", [this.phineas, this.lindana]);
        fletcherFamily.createRelation("lindana-motherOf-candace", "MotherOf", [this.lindana, this.candace]);
        fletcherFamily.createRelation("candace-daughterOf-lindana", "DaughterOf", [this.candace, this.lindana]);
        fletcherFamily.createRelation("lindana-stepMotherOf-ferb", "StepMotherOf", [this.lindana, this.ferb]);
        fletcherFamily.createRelation("ferb-stepSonOf-lindana", "StepSonOf", [this.ferb, this.lindana]);

        fletcherFamily.createRelation("lawrence-stepFatherOf-phineas", "StepFatherOf", [this.lawrence, this.phineas]);
        fletcherFamily.createRelation("phineas-stepSonOf-lawrence", "StepSonOf", [this.phineas, this.lawrence]);
        fletcherFamily.createRelation("lawrence-stepFatherOf-candace", "StepFatherOf", [this.lawrence, this.candace]);
        fletcherFamily.createRelation("candace-stepDaughterOf-lawrence", "StepDaughterOf", [this.candace, this.lawrence]);
        fletcherFamily.createRelation("lawrence-fatherOf-ferb", "FatherOf", [this.lawrence, this.ferb]);
        fletcherFamily.createRelation("ferb-sonOf-lawrence", "SonOf", [this.ferb, this.lawrence]);

        this.conceptualGraphDao.createConceptualGraph(fletcherFamily);

    }

    private _createFriendRelations() {
        // throw new Error("Method not implemented.");
    }

    private _createOtherRelations() {
    }



}