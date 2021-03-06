import { ConceptualGraph, ConceptualGraphSkeleton } from "../domain/ConceptualGraph";

export interface FactDao {
    importFacts(factsToImport: ConceptualGraphSkeleton[]);
    createFact(fact: ConceptualGraph): ConceptualGraph;
    getFactById(id: string): ConceptualGraph;
    getFactByLabel(label: string): ConceptualGraph;
    updateFact(fact: ConceptualGraph): ConceptualGraph;
    deleteFact(idToDelete: string): boolean;
}