import { Concept } from "../../main/domain/Concept";
import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";
import { Relation } from "../../main/domain/Relation";
import { RelationType } from "../../main/domain/RelationType";

describe('ConceptualGraph', () => {

    it('Add single concept', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const singleConcept: Concept = new Concept();
        singleConcept.conceptType = new ConceptType();
        singleConcept.referent = "SingleConcept";

        conceptualGraph.addConcept(singleConcept);
    })

    it('Add single concept and single relation', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();

        const singleConcept: Concept = new Concept();
        singleConcept.id = "C1";
        singleConcept.conceptType = new ConceptType();
        singleConcept.conceptType.id = "1";
        singleConcept.conceptType.description = "Entity";
        singleConcept.referent = "SingleConcept";

        const singleRelation: Relation = new Relation();
        singleRelation.id = "R1";
        singleRelation.relationType = new RelationType();
        singleRelation.relationType.description = "Link";
        singleRelation.relationType.signature = ["1"];

        conceptualGraph.addConcept(singleConcept);
        conceptualGraph.addRelation(singleRelation, [singleConcept]);

        expect(conceptualGraph.concepts).toEqual([singleConcept]);
        expect(conceptualGraph.relations).toEqual([singleRelation]);
        expect(conceptualGraph.edges).toEqual([{
            conceptId: "C1",
            relationId: "R1",
            isFromConceptToRelation: true
        }]);
    })

})