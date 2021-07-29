export class ConceptRelationEdge {
    id: {
        edgeId: string;
        conceptualGraphId: string
    }
    conceptLabel: string;
    relationLabel: string;
    isFromConceptToRelation: boolean;
}