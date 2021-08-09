import { ConceptualGraph } from "../domain/ConceptualGraph";

export interface ConceptualGraphDao {
    createConceptualGraph(conceptualGraph: ConceptualGraph): ConceptualGraph;  
    getConceptualGraphById(id: string): ConceptualGraph; 
    getConceptualGraphByLabel(label: string): ConceptualGraph;
    updateConceptualGraph(conceptualGraph: ConceptualGraph): ConceptualGraph;
}