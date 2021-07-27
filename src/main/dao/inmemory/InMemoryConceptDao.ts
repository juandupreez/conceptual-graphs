import { Concept } from "../../domain/Concept";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptDao } from "../ConceptDao";
import { ConceptTypeDao } from "../ConceptTypeDao";

export class InMemoryConceptDao implements ConceptDao{
    conceptTypeDao: ConceptTypeDao;

    constructor( conceptTypeDao: ConceptTypeDao) {
        this.conceptTypeDao = conceptTypeDao;
    }

    createConcept(newConceptLabel: string, conceptTypeLabel: string, referent: string): Concept {
        const newConcept: Concept = new Concept();
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptId();
        newConcept.id = generatedId;
        newConcept.label = newConceptLabel;
        newConcept.conceptTypeLabels.push(conceptTypeLabel);
        newConcept.referent = referent;
        return newConcept;
    }

}