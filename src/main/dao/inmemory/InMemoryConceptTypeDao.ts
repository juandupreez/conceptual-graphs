import { ConceptType } from "../../domain/ConceptType";
import { IdGenerator } from "../../util/IdGenerator";
import { ConceptTypeDao } from "../ConceptTypeDao";

export class InMemoryConceptTypeDao implements ConceptTypeDao {

    conceptTypes: ConceptType[] = [];

    insertConceptTypeAtRoot(conceptType: ConceptType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId();
        conceptType.id = generatedId;
        this.conceptTypes.push(conceptType);
        return generatedId;
    }
    
    getConceptTypeById(idToFind: string): ConceptType {
        const foundConceptType: ConceptType = this.conceptTypes.find((singleConceptType) => {
            return (singleConceptType.id === idToFind);
        })
        return foundConceptType;
    }

    insertConceptTypeAsSubtype(parentConceptType: ConceptType, subConceptType: ConceptType): string {
        const generatedId = IdGenerator.getInstance().getNextUniqueConceptTypeId(); 
        subConceptType.id = generatedId;
        this.conceptTypes.push(subConceptType);
        parentConceptType.subConceptTypeIds.push(subConceptType.id);
        subConceptType.parentConceptTypeIds.push(parentConceptType.id)
        return generatedId;      
    }

}