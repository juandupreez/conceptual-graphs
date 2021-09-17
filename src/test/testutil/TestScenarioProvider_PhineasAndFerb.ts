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
    baljeet: Concept;
    buford: Concept;
    isabella: Concept;
    perryThePlatypus: Concept;
    pinkyTheChihuahua: Concept;
    doofenshmirtz: Concept;

    nerdy: Concept;



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
                        { label: "Bully" },
                    ]
                },
                {
                    label: "Animal",
                    subConceptTypes: [
                        { label: "Platypus" },
                        {
                            label: "Dog",
                            subConceptTypes: [
                                { label: "Chihuahua" }
                            ]
                        },
                    ]
                },
                {
                    label: "Property"
                }
            ]
        }]);
    }

    private _createRelationTypes() {
        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkOne",
            signature: ["Entity"],
            subRelationTypes: [{
                label: "Not",
                signature: ["Entity"]
            }]
        }, {
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
            }, {
                label: "FriendOf",
                signature: ["Human", "Human"]
            }, {
                label: "OwnsPet",
                signature: ["Human", "Animal"]
            },{
                label: "Attribute",
                signature: ["Entity", "Property"]
            }]
        }, {
            label: "LinkThree",
            signature: ["Entity", "Entity", "Entity"],
            subRelationTypes: [{
                label: "Between",
                signature: ["Human", "Human", "Human"]
            }]
        }]);
    }

    private _createCharacters() {
        this.phineas = this.conceptDao.createConcept("Phineas", ["Boy"], "Phineas");
        this.ferb = this.conceptDao.createConcept("Ferb", ["Boy"], "Ferb");
        this.candace = this.conceptDao.createConcept("Candace", ["Girl"], "Candace");

        this.lawrence = this.conceptDao.createConcept("Lawrence", ["Man"], "Lawrence");
        this.lindana = this.conceptDao.createConcept("Lindana", ["Woman"], "Lindana");

        this.baljeet = this.conceptDao.createConcept("Baljeet", ["Boy"], "Baljeet");
        this.buford = this.conceptDao.createConcept("Buford", ["Boy", "Bully"], "Buford");
        this.isabella = this.conceptDao.createConcept("Isabella", ["Boy"], "Isabella");

        this.perryThePlatypus = this.conceptDao.createConcept("PerryThePlatypus", ["Platypus"], "Perry");
        this.pinkyTheChihuahua = this.conceptDao.createConcept("PinkyTheChihuahua", ["Chihuahua"], "Pinky");

        this.doofenshmirtz = this.conceptDao.createConcept("Doofenshmirtz", ["Man"], "Doofenshmirtz");
    }

    private _createOtherConcepts() {
        this.nerdy = this.conceptDao.createConcept("Nerdy", ["Property"], "Nerdy");
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
        const friendGroup: ConceptualGraph = new ConceptualGraph();

        // Friends of baljeet
        friendGroup.createRelation("phineas-friendOf-baljeet", "FriendOf", [this.phineas, this.baljeet]);
        friendGroup.createRelation("ferb-friendOf-baljeet", "FriendOf", [this.ferb, this.baljeet]);
        friendGroup.createRelation("buford-friendOf-baljeet", "FriendOf", [this.buford, this.baljeet]);
        friendGroup.createRelation("isabella-friendOf-baljeet", "FriendOf", [this.isabella, this.baljeet]);

        // Friends of buford
        friendGroup.createRelation("phineas-friendOf-buford", "FriendOf", [this.phineas, this.buford]);
        friendGroup.createRelation("ferb-friendOf-buford", "FriendOf", [this.ferb, this.buford]);
        friendGroup.createRelation("baljeet-friendOf-buford", "FriendOf", [this.baljeet, this.buford]);
        friendGroup.createRelation("isabella-friendOf-buford", "FriendOf", [this.isabella, this.buford]);

        // Friends of isabella
        friendGroup.createRelation("phineas-friendOf-isabella", "FriendOf", [this.phineas, this.isabella]);
        friendGroup.createRelation("ferb-friendOf-isabella", "FriendOf", [this.ferb, this.isabella]);
        friendGroup.createRelation("baljeet-friendOf-isabella", "FriendOf", [this.baljeet, this.isabella]);
        friendGroup.createRelation("buford-friendOf-isabella", "FriendOf", [this.buford, this.isabella]);

        // Friends of phineas
        friendGroup.createRelation("isabella-friendOf-phineas", "FriendOf", [this.isabella, this.phineas]);
        friendGroup.createRelation("ferb-friendOf-phineas", "FriendOf", [this.ferb, this.phineas]);
        friendGroup.createRelation("baljeet-friendOf-phineas", "FriendOf", [this.baljeet, this.phineas]);
        friendGroup.createRelation("buford-friendOf-phineas", "FriendOf", [this.buford, this.phineas]);

        // Friends of ferb
        friendGroup.createRelation("isabella-friendOf-ferb", "FriendOf", [this.isabella, this.ferb]);
        friendGroup.createRelation("ferb-friendOf-ferb", "FriendOf", [this.ferb, this.ferb]);
        friendGroup.createRelation("baljeet-friendOf-ferb", "FriendOf", [this.baljeet, this.ferb]);
        friendGroup.createRelation("buford-friendOf-ferb", "FriendOf", [this.buford, this.ferb]);

        this.conceptualGraphDao.createConceptualGraph(friendGroup);
    }

    private _createOtherRelations() {
        const petRelations: ConceptualGraph = new ConceptualGraph();

        // Perry the Platypus
        petRelations.createRelation("phineas-ownsPet-perry", "OwnsPet", [this.phineas, this.perryThePlatypus]);
        petRelations.createRelation("ferb-ownsPet-perry", "OwnsPet", [this.ferb, this.perryThePlatypus]);
        petRelations.createRelation("candace-ownsPet-perry", "OwnsPet", [this.candace, this.perryThePlatypus]);

        // Pinky the Chihuahua
        petRelations.createRelation("isabella-ownsPet-pinky", "OwnsPet", [this.isabella, this.pinkyTheChihuahua]);

        this.conceptualGraphDao.createConceptualGraph(petRelations);

        // Buford not a nerd
        const bufordNotNerdy: ConceptualGraph = new ConceptualGraph();
        bufordNotNerdy.addConcept(this.buford);
        bufordNotNerdy.addConcept(this.nerdy);
        bufordNotNerdy.createRelation("buford-attr-nerdy", "Attribute", [this.buford, this.nerdy]);
        bufordNotNerdy.createRelation("not-nerdy", "Not", [this.nerdy]);
        this.conceptualGraphDao.createConceptualGraph(bufordNotNerdy);

        // Between
        const isabellaBetweenPhineasAndFerb: ConceptualGraph = new ConceptualGraph();
        isabellaBetweenPhineasAndFerb.addConcept(this.isabella);
        isabellaBetweenPhineasAndFerb.addConcept(this.phineas);
        isabellaBetweenPhineasAndFerb.addConcept(this.ferb);
        isabellaBetweenPhineasAndFerb.createRelation("isabella-between-phineas-and-ferb", "Between", [this.isabella, this.phineas, this.ferb]);
        this.conceptualGraphDao.createConceptualGraph(isabellaBetweenPhineasAndFerb);
    }
    
    getPhineasAndCandaceCG(): ConceptualGraph {
        const fletcherFamily: ConceptualGraph = new ConceptualGraph();
        fletcherFamily.addConcept(this.phineas);
        fletcherFamily.addConcept(this.candace);
        fletcherFamily.createRelation("phineas-broOf-candace", "BrotherOf", [this.phineas, this.candace]);
        return fletcherFamily;
    }

    getPhineasFerbAndFriendsCG(): ConceptualGraph {
        const phineasFerbAndFriends: ConceptualGraph = new ConceptualGraph();

        const phineas: Concept = phineasFerbAndFriends.createConcept("Phineas", "Boy", "Phineas");
        const ferb: Concept = phineasFerbAndFriends.createConcept("Ferb", "Boy", "Ferb");
        
        const baljeet: Concept = phineasFerbAndFriends.createConcept("Baljeet", "Boy", "Baljeet");
        phineasFerbAndFriends.createRelation("baljeet-friendOf-phineas", "FriendOf", [baljeet, phineas]);
        phineasFerbAndFriends.createRelation("baljeet-friendOf-ferb", "FriendOf", [baljeet, ferb]);
        
        const buford: Concept = phineasFerbAndFriends.createConcept("Buford", "Boy", "Buford");
        phineasFerbAndFriends.createRelation("buford-friendOf-phineas", "FriendOf", [buford, phineas]);
        phineasFerbAndFriends.createRelation("buford-friendOf-ferb", "FriendOf", [buford, ferb]);
        
        const isabella: Concept = phineasFerbAndFriends.createConcept("Isabella", "Girl", "Isabella");
        phineasFerbAndFriends.createRelation("isabella-friendOf-phineas", "FriendOf", [isabella, phineas]);
        phineasFerbAndFriends.createRelation("isabella-friendOf-ferb", "FriendOf", [isabella, ferb]);

        return phineasFerbAndFriends;
    }
    
    getBaljeetFriendsOfPhineasAndFerbCG(): ConceptualGraph {
        const baljeetFriendsOfPhineasAndFerb: ConceptualGraph = new ConceptualGraph();

        const phineas: Concept = baljeetFriendsOfPhineasAndFerb.createConcept("Phineas", "Boy", "Phineas");
        const ferb: Concept = baljeetFriendsOfPhineasAndFerb.createConcept("Ferb", "Boy", "Ferb");
        
        const baljeet: Concept = baljeetFriendsOfPhineasAndFerb.createConcept("Baljeet", "Boy", "Baljeet");
        baljeetFriendsOfPhineasAndFerb.createRelation("baljeet-friendOf-phineas", "FriendOf", [baljeet, phineas]);
        baljeetFriendsOfPhineasAndFerb.createRelation("baljeet-friendOf-ferb", "FriendOf", [baljeet, ferb]);
        
        return baljeetFriendsOfPhineasAndFerb;
    }

}