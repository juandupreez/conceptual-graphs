import { Concept } from "../../domain/Concept";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { ConceptTypeDao } from "../ConceptTypeDao";
import { Store } from "./store/Store";

export class InMemoryConceptDao implements ConceptDao{
    conceptTypeDao: ConceptTypeDao;

    constructor( conceptTypeDao: ConceptTypeDao) {
        this.conceptTypeDao = conceptTypeDao;
    }

    createConcept(newConceptLabel: string, conceptTypeLabel: string, referent: string): Concept {
        const newConcept: Concept = new Concept();
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptId();
        if (!newConcept.id) {
            newConcept.id = {
                conceptId: null,
                conceptualGraphId: null
            }
        }
        newConcept.id.conceptId = generatedId;
        newConcept.label = newConceptLabel;
        newConcept.conceptTypeLabels.push(conceptTypeLabel);
        newConcept.referent = referent;
        return newConcept;
    }

    insertConcept(singleConcept: Concept) {
        if (!singleConcept.id) {
            singleConcept.id.conceptId = IdGenerator.getInstance().getNextUniqueConceptId();
        }
        Store.getInstance().state.concepts.push(singleConcept);
    }

}