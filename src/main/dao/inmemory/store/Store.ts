import { ConceptType } from "../../../domain/ConceptType";
import { RelationType } from "../../../domain/RelationType";

class ConceptualGraphState {
    conceptTypes: ConceptType[] = [];
    rootConceptTypeIds: string[] = [];
    relationTypes: RelationType[] = [];
    rootRelationTypeIds: string[] = [];
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