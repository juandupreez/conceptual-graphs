import { Concept } from "../../main/domain/Concept";
import { ConceptType } from "../../main/domain/ConceptType";
import { ConceptualGraph } from "../../main/domain/ConceptualGraph";

describe('ConceptualGraph', () => {

    it('Add single concept', () => {
        const conceptualGraph: ConceptualGraph = new ConceptualGraph();
        const singleConcept: Concept = new Concept();
        singleConcept.conceptType = new ConceptType();
        singleConcept.referent = "SingleConcept";

        conceptualGraph.addConcept(singleConcept);
    })

})