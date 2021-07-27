import { Concept } from "../../domain/Concept";
import { ConceptDao } from "../ConceptDao";

export class InMemoryConceptDao implements ConceptDao{
    createConcept(label: string, conceptTypeLabel: string, referent: string): Concept {
        throw new Error("Method not implemented.");
    }

}