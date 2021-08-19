import { ConceptDao } from "../../main/dao/ConceptDao";
import { ConceptTypeDao } from "../../main/dao/ConceptTypeDao";
import { ConceptualGraphDao } from "../../main/dao/ConceptualGraphDao";
import { RelationDao } from "../../main/dao/RelationDao";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { Concept } from "../../main/domain/Concept";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";

export class TestScenarioProvider {
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
        const flyntTheBirdIsYellow: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity"]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity"]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

        const flyntConceptLabel: string = "Flynt-" + testId;
        const flynt: Concept = flyntTheBirdIsYellow.createConcept(flyntConceptLabel, birdConceptTypeLabel, flyntConceptLabel);
        const yellowConceptLabel: string = "Yellow-" + testId;
        const yellow: Concept = flyntTheBirdIsYellow.createConcept(yellowConceptLabel, colourConceptTypeLabel, yellowConceptLabel);
        const flyntAttrYellowRelationLabel: string = "flynt-attribute-yellow-" + testId;
        const flyntAttrYellowRelation: Relation
            = flyntTheBirdIsYellow.createRelation(flyntAttrYellowRelationLabel, attributeRelationTypeLabel, [flynt, yellow]);

        this.conceptualGraphDao.createConceptualGraph(flyntTheBirdIsYellow);
    }

    createConcept_flyntTheBirdIsColourYellowAndBlue(testId: string) {
        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, ["Entity"]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, ["Entity"]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

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

    createConcept_flyntTheBirdIsColourYellowAndBlueWithSubConceptTypes(testId: string) {
        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity"]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity"]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], ["LinkTwo"])

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

    createConcept_flyntTheBirdIsColourYellowAndBlueWithSubRelationTypes(testId: string) {
        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity"]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity"]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo"]);
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

    createConcept_flyntTheBirdIsColourYellowAndBlueWithReverseRelation(testId: string) {
        const flyntTheBirdIsYellowAndBlue: ConceptualGraph = new ConceptualGraph();

        const animalConceptTypeLabel: string = "Animal-" + testId;
        this.conceptTypeDao.createConceptType(animalConceptTypeLabel, ["Entity"]);
        const birdConceptTypeLabel: string = "Bird-" + testId;
        this.conceptTypeDao.createConceptType(birdConceptTypeLabel, [animalConceptTypeLabel]);

        const shadeOfLightConceptTypeLabel: string = "ShadeOfLight-" + testId;
        this.conceptTypeDao.createConceptType(shadeOfLightConceptTypeLabel, ["Entity"]);
        const colourConceptTypeLabel: string = "Colour-" + testId;
        this.conceptTypeDao.createConceptType(colourConceptTypeLabel, [shadeOfLightConceptTypeLabel]);

        const propertyRelationTypeLabel: string = "Property-" + testId;
        const propertyRelationType: RelationType
            = this.relationTypeDao.createRelationType(propertyRelationTypeLabel, [animalConceptTypeLabel, shadeOfLightConceptTypeLabel], ["LinkTwo"]);
        const attributeRelationTypeLabel: string = "Attribute-" + testId;
        const attributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(attributeRelationTypeLabel, [birdConceptTypeLabel, colourConceptTypeLabel], [propertyRelationTypeLabel]);
        const reverseAttributeRelationTypeLabel: string = "ReverseAttribute-" + testId;
        const reverseAttributeRelationType: RelationType
            = this.relationTypeDao.createRelationType(reverseAttributeRelationTypeLabel, [colourConceptTypeLabel, birdConceptTypeLabel], ["LinkTwo"]);

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
}