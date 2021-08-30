import { ConceptualGraph } from "../domain/ConceptualGraph";

export class Rule {
    id: string;
    label: string;
    ruleType: RuleType;

    hypothesis: ConceptualGraph;
    conclusion: ConceptualGraph;

    applyRule(inputConceptualGraph: ConceptualGraph): ConceptualGraph {
        return new ConceptualGraph();
    }

}

export enum RuleType {
    SATURATION_RULE = 'SATURATION_RULE',
    EXTRACTION_RULE = 'EXTRACTION_RULE',
    ACTION_RULE = 'ACTION_RULE'
}