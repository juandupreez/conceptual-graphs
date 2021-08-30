import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";

export class TestScenarioProvider_FlyntTheBird {
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


    createConcept_flyntTheBirdIsColourYellow(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellow: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellow.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellow.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellow);
    }

    getConcept_flyntTheBirdIsColourYellow(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellow: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellow.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellow.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);

        return flyntTheBirdIsYellow;
    }

    createConcept_flyntTheBirdIsColourYellowAndBlue(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
    }

    getConcept_flyntTheBirdIsColourYellowAndBlue(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity-" + testId]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        return flyntTheBirdIsYellowAndBlue;
    }

    createConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
    }

    getConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity-" + testId]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo-" + testId])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        return flyntTheBirdIsYellowAndBlue;
    }

    createConcept_flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
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

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
    }

    getConcept_flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
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

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);

        return flyntTheBirdIsYellowAndBlue;
    }

    createConcept_flyntTheBirdIsColourYellowAndBlueWithReverseRelation(testId: string) {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
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

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);
        const blueAttrFlyntRelationLabel: string = "blue-attribute-flynt-reverse-" + testId;
        const blueAttrFlyntReverseRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(blueAttrFlyntRelationLabel, reverseAttributeRelationTypeLabel, [blue, flynt]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellowAndBlue);
    }

    getConcept_flyntTheBirdIsColourYellowAndBlueWithReverseRelation(testId: string): ConceptualGraph {
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId
        }]);

        this.relationTypeDao.importHierarchyFromSimpleRelationTypes([{
            label: "LinkTwo-" + testId,
            signature: ["Entity-" + testId, "Entity-" + testId]
        }]);

        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity-" + testId]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
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

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellowAndBlue.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellowAndBlue.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const blueConceptLabel: string = "Blue-" + testId;
        const blue: Concept = flyntTheBirdIsYellowAndBlue.createConcept(blueConceptLabel, colourConceptTypeLabel, blueConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);
        const flyntAttrBlueRelationLabel: string = "flynt-attribute-blue-" + testId;
        const flyntAttrBlueRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(flyntAttrBlueRelationLabel, attributeRelationTypeLabel, [flynt, blue]);
        const blueAttrFlyntRelationLabel: string = "blue-attribute-flynt-reverse-" + testId;
        const blueAttrFlyntReverseRelation: Relation
            = flyntTheBirdIsYellowAndBlue.createRelation(blueAttrFlyntRelationLabel, reverseAttributeRelationTypeLabel, [blue, flynt]);

        return flyntTheBirdIsYellowAndBlue;
    }

    createConcept_threeAnimalsWithColourAndAllThreeCute(testId: string) {

        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Bird-" + testId },
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

        // Create Concepttual Graph: Flynt Is Yellow and Cute
        const flyntIsYellowAndCute: ConceptualGraph = new ConceptualGraph();
        const flyntConcept: Concept = flyntIsYellowAndCute.createConcept("Flynt-" + testId, "Bird-" + testId);
        const yellowConcept: Concept = flyntIsYellowAndCute.createConcept("Yellow-" + testId, "Colour-" + testId);
        flyntIsYellowAndCute.createRelation("flynt-attribute-yellow-" + testId, "Attribute-" + testId, [flyntConcept, yellowConcept]);
        flyntIsYellowAndCute.createRelation("flynt-attribute-cute-" + testId, "Attribute-" + testId, [flyntConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(flyntIsYellowAndCute);

        // Create Concepttual Graph: Rhysand Is Blue and Cute
        const rhysandIsBlueAndCute: ConceptualGraph = new ConceptualGraph();
        const rhysandConcept: Concept = rhysandIsBlueAndCute.createConcept("Rhysand-" + testId, "Cat-" + testId);
        const blueConcept: Concept = rhysandIsBlueAndCute.createConcept("Blue-" + testId, "Colour-" + testId);
        rhysandIsBlueAndCute.createRelation("rhysand-attribute-blue-" + testId, "Attribute-" + testId, [rhysandConcept, blueConcept]);
        rhysandIsBlueAndCute.createRelation("rhysand-attribute-cute-" + testId, "Attribute-" + testId, [rhysandConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(rhysandIsBlueAndCute);

        // Create Concepttual Graph: Rusky Is Red and Cute
        const ruskyIsRedAndCute: ConceptualGraph = new ConceptualGraph();
        const ruskyConcept: Concept = ruskyIsRedAndCute.createConcept("Rusky-" + testId, "Dog-" + testId);
        const redConcept: Concept = ruskyIsRedAndCute.createConcept("Red-" + testId, "Colour-" + testId);
        ruskyIsRedAndCute.createRelation("rusky-attribute-red-" + testId, "Attribute-" + testId, [ruskyConcept, redConcept]);
        ruskyIsRedAndCute.createRelation("rusky-attribute-cute-" + testId, "Attribute-" + testId, [ruskyConcept, cuteConcept]);
        this.conceptualGraphDao.createConceptualGraph(ruskyIsRedAndCute);
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
                        { label: "Bird-" + testId },
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

        // Create Concepttual Graph: Flynt Is Yellow and Cute
        const flyntConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Flynt-" + testId, "Bird-" + testId, "Flynt-" + testId);
        const yellowConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Yellow-" + testId, "Colour-" + testId, "Yellow-" + testId);
        threeAnimalsWithColourAndCute.createRelation("flynt-attribute-yellow-" + testId, "Attribute-" + testId, [flyntConcept, yellowConcept]);
        threeAnimalsWithColourAndCute.createRelation("flynt-attribute-cute-" + testId, "Attribute-" + testId, [flyntConcept, cuteConcept]);

        // Create Concepttual Graph: Rhysand Is Blue and Cute
        const rhysandConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Rhysand-" + testId, "Cat-" + testId, "Rhysand-" + testId);
        const blueConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Blue-" + testId, "Colour-" + testId, "Blue-" + testId);
        threeAnimalsWithColourAndCute.createRelation("rhysand-attribute-blue-" + testId, "Attribute-" + testId, [rhysandConcept, blueConcept]);
        threeAnimalsWithColourAndCute.createRelation("rhysand-attribute-cute-" + testId, "Attribute-" + testId, [rhysandConcept, cuteConcept]);

        // Create Concepttual Graph: Rusky Is Red and Cute
        const ruskyConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Rusky-" + testId, "Dog-" + testId, "Rusky-" + testId);
        const redConcept: Concept = threeAnimalsWithColourAndCute.createConcept("Red-" + testId, "Colour-" + testId, "Red-" + testId);
        threeAnimalsWithColourAndCute.createRelation("rusky-attribute-red-" + testId, "Attribute-" + testId, [ruskyConcept, redConcept]);
        threeAnimalsWithColourAndCute.createRelation("rusky-attribute-cute-" + testId, "Attribute-" + testId, [ruskyConcept, cuteConcept]);

        return threeAnimalsWithColourAndCute;
    }

    createConcept_yellowHasAttributeYellow(testId: string) {
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

        // Create Conceptual Graph: Flynt Is Yellow and Cute
        const flyntIsYellowAndCute: ConceptualGraph = new ConceptualGraph();
        const yellowConcept: Concept = flyntIsYellowAndCute.createConcept("Yellow-" + testId, "Colour-" + testId, "Yellow-" + testId);
        flyntIsYellowAndCute.createRelation("yellow-attribute-yellow-" + testId, "Attribute-" + testId, [yellowConcept, yellowConcept]);
        this.conceptualGraphDao.createConceptualGraph(flyntIsYellowAndCute);
    }

    getConcept_yellowHasAttributeYellow(testId: string) {
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

        // Create Conceptual Graph: Flynt Is Yellow and Cute
        const yellowIsYellow: ConceptualGraph = new ConceptualGraph();
        const yellowConcept: Concept = yellowIsYellow.createConcept("Yellow-" + testId, "Colour-" + testId, "Yellow-" + testId);
        yellowIsYellow.createRelation("yellow-attribute-yellow-" + testId, "Attribute-" + testId, [yellowConcept, yellowConcept]);
        return yellowIsYellow;
    }

    createConcept_flyntHasAttributeYellowHasAttributeFlynt(testId: string) {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Bird-" + testId }
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

        // Create Conceptual Graph: Flynt Is Yellow and yellow is flynt
        const flyntIsYellowAndCute: ConceptualGraph = new ConceptualGraph();
        const flyntConcept: Concept = flyntIsYellowAndCute.createConcept("Flynt-" + testId, "Bird-" + testId, "Flynt-" + testId);
        const yellowConcept: Concept = flyntIsYellowAndCute.createConcept("Yellow-" + testId, "Colour-" + testId, "Yellow-" + testId);
        flyntIsYellowAndCute.createRelation("flynt-attribute-yellow-" + testId, "Attribute-" + testId, [flyntConcept, yellowConcept]);
        flyntIsYellowAndCute.createRelation("yellow-attribute-flynt-" + testId, "Attribute-" + testId, [yellowConcept, flyntConcept]);
        this.conceptualGraphDao.createConceptualGraph(flyntIsYellowAndCute);
    }

    getConcept_flyntHasAttributeYellowHasAttributeFlynt(testId: string): ConceptualGraph {
        // Set up concept types and relation types
        this.conceptTypeDao.importHierarchyFromSimpleConceptTypes([{
            label: "Entity-" + testId,
            subConceptTypes: [
                {
                    label: "Animal-" + testId,
                    subConceptTypes: [
                        { label: "Bird-" + testId }
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

        // Create Conceptual Graph: Flynt Is Yellow and yellow is flynt
        const flyntIsYellowAndYellowIsFlynt: ConceptualGraph = new ConceptualGraph();
        const flyntConcept: Concept = flyntIsYellowAndYellowIsFlynt.createConcept("Flynt-" + testId, "Bird-" + testId, "Flynt-" + testId);
        const yellowConcept: Concept = flyntIsYellowAndYellowIsFlynt.createConcept("Yellow-" + testId, "Colour-" + testId, "Yellow-" + testId);
        flyntIsYellowAndYellowIsFlynt.createRelation("flynt-attribute-yellow-" + testId, "Attribute-" + testId, [flyntConcept, yellowConcept]);
        flyntIsYellowAndYellowIsFlynt.createRelation("yellow-attribute-flynt-" + testId, "Attribute-" + testId, [yellowConcept, flyntConcept]);
        return flyntIsYellowAndYellowIsFlynt;
    }
}