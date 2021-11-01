import { ConceptualGraph } from "../conceptual-graphs";

export class Operation {
    id: string;
    label: string;

    hypothesis: ConceptualGraph;
    conclusion: ConceptualGraph;

    applyOperation(inputConceptualGraph: ConceptualGraph): ConceptualGraph {
        return new ConceptualGraph();
    }

    toString(): string {
        return "Hypothesis:\n----------\n"
            + this.hypothesis.toString();
    }
}