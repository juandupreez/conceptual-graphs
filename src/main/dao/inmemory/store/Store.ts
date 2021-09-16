import { SimpleConceptualGraph } from "../../../conceptual-graphs";
import { Concept } from "../../../domain/Concept";
import { ConceptType } from "../../../domain/ConceptType";
import { Relation } from "../../../domain/Relation";
import { RelationType } from "../../../domain/RelationType";

class ConceptualGraphState {
    conceptTypes: ConceptType[] = [];
    rootConceptTypeIds: string[] = [];
    relationTypes: RelationType[] = [];
    rootRelationTypeIds: string[] = [];
    concepts: Concept[] = [];
    relations: Relation[] = [];
    simpleConceptualGarphs: SimpleConceptualGraph[] = [];
}

export class Store {
    state: ConceptualGraphState = new ConceptualGraphState();
    static instance: Store;

    static getInstance(): Store {
        if (!this.instance) {
            this.instance = new Store();
        }
        return this.instance;
    }
}