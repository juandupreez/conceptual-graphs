import { ConceptualGraph } from "../domain/ConceptualGraph";

export interface ConceptualGraphDao {
    insertConceptualGraph(conceptualGraph: ConceptualGraph): ConceptualGraph;    
}