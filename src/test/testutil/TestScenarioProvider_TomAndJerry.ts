import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";

export class TestScenarioProvider_TomAndJerry {
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    conceptualGraphDao: ConceptualGraphDao;

    constructor(conceptDao: ConceptDao, relationDao: RelationDao,
        conceptTypeDao: ConceptTypeDao, relationTypeDao: RelationTypeDao,
        conceptualtGraphDao: ConceptualGraphDao) {
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
        this.conceptTypeDao = conceptTypeDao;
        this.relationTypeDao = relationTypeDao;
        this.conceptualGraphDao = conceptualtGraphDao;
    }


    createConcept_jerryTheMouseIsColourBrown(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrown: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrown.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrown.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrown.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);

        this.conceptualGraphDao.createConceptualGraph(jerryTheMouseIsBrown);
    }

    getConcept_jerryTheMouseIsColourBrown(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrown: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrown.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrown.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrown.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);

        return jerryTheMouseIsBrown;
    }

    createConcept_jerryTheMouseIsColourBrownAndBlue(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        this.conceptualGraphDao.createConceptualGraph(jerryTheMouseIsBrownAndBlue);
    }

    getConcept_jerryTheMouseIsColourBrownAndBlue(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        return jerryTheMouseIsBrownAndBlue;
    }

    createConcept_jerryTheMouseIsColourBrownAndBlueWithSubConceptTypes(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        this.conceptualGraphDao.createConceptualGraph(jerryTheMouseIsBrownAndBlue);
    }

    getConcept_jerryTheMouseIsColourBrownAndBlueWithSubConceptTypes(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        return jerryTheMouseIsBrownAndBlue;
    }

    createConcept_jerryTheMouseIsColourBrownAndBlueWithSubRelationTypes(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], [propertyRelationTypeLabel]);

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        this.conceptualGraphDao.createConceptualGraph(jerryTheMouseIsBrownAndBlue);
    }

    getConcept_jerryTheMouseIsColourBrownAndBlueWithSubRelationTypes(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], [propertyRelationTypeLabel]);

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);

        return jerryTheMouseIsBrownAndBlue;
    }

    createConcept_jerryTheMouseIsColourBrownAndBlueWithReverseRelation(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], [propertyRelationTypeLabel]);
        const reverseAttributeRelationTypeLabel: string = "ReverseAttribute-" + testId;
        const reverseAttributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(reverseAttributeRelationTypeLabel, [colourConceptTypeLabel, birdConceptTypeLabel], ["LinkTwo-" + testId]);

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);
        const blueAttrJerryRelationLabel: string = "blue-attribute-jerry-reverse-" + testId;
        const blueAttrJerryReverseRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(blueAttrJerryRelationLabel, reverseAttributeRelationTypeLabel, [blue, jerry]);

        this.conceptualGraphDao.createConceptualGraph(jerryTheMouseIsBrownAndBlue);
    }

    getConcept_jerryTheMouseIsColourBrownAndBlueWithReverseRelation(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const jerryTheMouseIsBrownAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Mouse-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], [propertyRelationTypeLabel]);
        const reverseAttributeRelationTypeLabel: string = "ReverseAttribute-" + testId;
        const reverseAttributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(reverseAttributeRelationTypeLabel, [colourConceptTypeLabel, birdConceptTypeLabel], ["LinkTwo-" + testId]);

        const jerryConceptLabel: string = "Jerry-" + testId;
        const jerry: Concept = jerryTheMouseIsBrownAndBlue.createConcept(jerryConceptLabel, birdConceptTypeLabel, jerryConceptLabel);
        const brownConceptLabel: string = "Brown-" + testId;
        const brown: Concept = jerryTheMouseIsBrownAndBlue.createConcept(brownConceptLabel, colourConceptTypeLabel, brownConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = jerryTheMouseIsBrownAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const jerryAttrBrownRelationLabel: string = "jerry-attribute-brown-" + testId;
        const jerryAttrBrownRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBrownRelationLabel, attributeRelationTypeLabel, [jerry, brown]);
        const jerryAttrBlueRelationLabel: string = "jerry-attribute-blue-" + testId;
        const jerryAttrBlueRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(jerryAttrBlueRelationLabel, attributeRelationTypeLabel, [jerry, blue]);
        const blueAttrJerryRelationLabel: string = "blue-attribute-jerry-reverse-" + testId;
        const blueAttrJerryReverseRelation: Relation
            = jerryTheMouseIsBrownAndBlue.createRelation(blueAttrJerryRelationLabel, reverseAttributeRelationTypeLabel, [blue, jerry]);

        return jerryTheMouseIsBrownAndBlue;
    }

    createConcept_threeAnimalsWithColourAndAllThreeCute(testId: string) {

        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Mouse-" + testId },
                        { label: "Cat-" + testId },
                        { label: "Dog-" + testId }
                    ]
                },
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId },
                        { label: "Cute-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Descriptor-" + testId]
                    }
                ]
            }
        ]);

        // Create Concept Cute
        const cuteConcept: Concept = this.conceptDao.createConcept("AnyCute-" + testId, ["Cute-" + testId]);

        // Create Concepttual Graph: Jerry Is Brown and Cute
        const jerryIsBrownAndCute: ConceptualGraph = new ConceptualGraph();
        const jerryConcept: Concept = jerryIsBrownAndCute.createConcept("Jerry-" + testId, "Mouse-" + testId);
        const brownConcept: Concept = jerryIsBrownAndCute.createConcept("Brown-" + testId, "Colour-" + testId);
        jerryIsBrownAndCute.createRelation("jerry-attribute-brown-" + testId, "Attribute-" + testId, [jerryConcept, brownConcept]);
        jerryIsBrownAndCute.createRelation("jerry-attribute-cute-" + testId, "Attribute-" + testId, [jerryConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(jerryIsBrownAndCute);

        // Create Concepttual Graph: Tom Is Blue and Cute
        const tomIsBlueAndCute: ConceptualGraph = new ConceptualGraph();
        const tomConcept: Concept = tomIsBlueAndCute.createConcept("Tom-" + testId, "Cat-" + testId);
        const blueConcept: Concept = tomIsBlueAndCute.createConcept("Blue-" + testId, "Colour-" + testId);
        tomIsBlueAndCute.createRelation("tom-attribute-blue-" + testId, "Attribute-" + testId, [tomConcept, blueConcept]);
        tomIsBlueAndCute.createRelation("tom-attribute-cute-" + testId, "Attribute-" + testId, [tomConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(tomIsBlueAndCute);

        // Create Concepttual Graph: Spike Is Red and Cute
        const spikeIsRedAndCute: ConceptualGraph = new ConceptualGraph();
        const spikeConcept: Concept = spikeIsRedAndCute.createConcept("Spike-" + testId, "Dog-" + testId);
        const redConcept: Concept = spikeIsRedAndCute.createConcept("Red-" + testId, "Colour-" + testId);
        spikeIsRedAndCute.createRelation("spike-attribute-red-" + testId, "Attribute-" + testId, [spikeConcept, redConcept]);
        spikeIsRedAndCute.createRelation("spike-attribute-cute-" + testId, "Attribute-" + testId, [spikeConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(spikeIsRedAndCute);
    }

    getConcept_threeAnimalsWithColourAndAllThreeCute(testId: string): ConceptualGraph {

        const threeAnimalsWithColourAndCute: ConceptualGraph = new ConceptualGraph();
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Mouse-" + testId },
                        { label: "Cat-" + testId },
                        { label: "Dog-" + testId }
                    ]
                },
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId },
                        { label: "Cute-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Descriptor-" + testId]
                    }
                ]
            }
        ]);

        // Create Concept Cute
        const cuteConcept: Concept = threeAnimalsWithColourAndCute.createConcept("AnyCute-" + testId, ["Cute-" + testId]);

        // Create Concepttual Graph: Jerry Is Brown and Cute
        const jerryConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Jerry-" + testId, "Mouse-" + testId, "Jerry-" + testId);
        const brownConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Brown-" + testId, "Colour-" + testId, "Brown-" + testId);
        threeAnimalsWithColourAndCute.createRelation("jerry-attribute-brown-" + testId, "Attribute-" + testId, [jerryConcept, brownConcept]);
        threeAnimalsWithColourAndCute.createRelation("jerry-attribute-cute-" + testId, "Attribute-" + testId, [jerryConcept, cuteConcept]);

        // Create Concepttual Graph: Tom Is Blue and Cute
        const tomConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Tom-" + testId, "Cat-" + testId, "Tom-" + testId);
        const blueConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Blue-" + testId, "Colour-" + testId, "Blue-" + testId);
        threeAnimalsWithColourAndCute.createRelation("tom-attribute-blue-" + testId, "Attribute-" + testId, [tomConcept, blueConcept]);
        threeAnimalsWithColourAndCute.createRelation("tom-attribute-cute-" + testId, "Attribute-" + testId, [tomConcept, cuteConcept]);

        // Create Concepttual Graph: Spike Is Red and Cute
        const spikeConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Spike-" + testId, "Dog-" + testId, "Spike-" + testId);
        const redConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Red-" + testId, "Colour-" + testId, "Red-" + testId);
        threeAnimalsWithColourAndCute.createRelation("spike-attribute-red-" + testId, "Attribute-" + testId, [spikeConcept, redConcept]);
        threeAnimalsWithColourAndCute.createRelation("spike-attribute-cute-" + testId, "Attribute-" + testId, [spikeConcept, cuteConcept]);

        return threeAnimalsWithColourAndCute;
    }

    createConcept_brownHasAttributeBrown(testId: string) {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Entity-" + testId]
                    }
                ]
            }
        ]);

        // Create Conceptual Graph: Jerry Is Brown and Cute
        const jerryIsBrownAndCute: ConceptualGraph = new ConceptualGraph();
        const brownConcept: Concept = jerryIsBrownAndCute.createConcept("Brown-" + testId, "Colour-" + testId, "Brown-" + testId);
        jerryIsBrownAndCute.createRelation("brown-attribute-brown-" + testId, "Attribute-" + testId, [brownConcept, brownConcept]);
        this.conceptualGraphDao.createConceptualGraph(jerryIsBrownAndCute);
    }

    getConcept_brownHasAttributeBrown(testId: string) {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Entity-" + testId]
                    }
                ]
            }
        ]);

        // Create Conceptual Graph: Jerry Is Brown and Cute
        const brownIsBrown: ConceptualGraph = new ConceptualGraph();
        const brownConcept: Concept = brownIsBrown.createConcept("Brown-" + testId, "Colour-" + testId, "Brown-" + testId);
        brownIsBrown.createRelation("brown-attribute-brown-" + testId, "Attribute-" + testId, [brownConcept, brownConcept]);
        return brownIsBrown;
    }

    createConcept_jerryHasAttributeBrownHasAttributeJerry(testId: string) {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Mouse-" + testId }
                    ]
                },
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Entity-" + testId]
                    }
                ]
            }
        ]);

        // Create Conceptual Graph: Jerry Is Brown and brown is jerry
        const jerryIsBrownAndCute: ConceptualGraph = new ConceptualGraph();
        const jerryConcept: Concept = jerryIsBrownAndCute.createConcept("Jerry-" + testId, "Mouse-" + testId, "Jerry-" + testId);
        const brownConcept: Concept = jerryIsBrownAndCute.createConcept("Brown-" + testId, "Colour-" + testId, "Brown-" + testId);
        jerryIsBrownAndCute.createRelation("jerry-attribute-brown-" + testId, "Attribute-" + testId, [jerryConcept, brownConcept]);
        jerryIsBrownAndCute.createRelation("brown-attribute-jerry-" + testId, "Attribute-" + testId, [brownConcept, jerryConcept]);
        this.conceptualGraphDao.createConceptualGraph(jerryIsBrownAndCute);
    }

    getConcept_jerryHasAttributeBrownHasAttributeJerry(testId: string): ConceptualGraph {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Mouse-" + testId }
                    ]
                },
                {
                    label: "Descriptor-" + testId,
                    subConceptTypes: [
                        { label: "Colour-" + testId }
                    ]
                }
            ]
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([
            {
                label: "LinkTwo-" + testId,
                signature: ["Entity-" + testId, "Entity-" + testId],
                subRelationTypes: [
                    {
                        label: "Attribute-" + testId,
                        signature: ["Entity-" + testId, "Entity-" + testId]
                    }
                ]
            }
        ]);

        // Create Conceptual Graph: Jerry Is Brown and brown is jerry
        const jerryIsBrownAndBrownIsJerry: ConceptualGraph = new ConceptualGraph();
        const jerryConcept: Concept = jerryIsBrownAndBrownIsJerry.createConcept("Jerry-" + testId, "Mouse-" + testId, "Jerry-" + testId);
        const brownConcept: Concept = jerryIsBrownAndBrownIsJerry.createConcept("Brown-" + testId, "Colour-" + testId, "Brown-" + testId);
        jerryIsBrownAndBrownIsJerry.createRelation("jerry-attribute-brown-" + testId, "Attribute-" + testId, [jerryConcept, brownConcept]);
        jerryIsBrownAndBrownIsJerry.createRelation("brown-attribute-jerry-" + testId, "Attribute-" + testId, [brownConcept, jerryConcept]);
        return jerryIsBrownAndBrownIsJerry;
    }
}