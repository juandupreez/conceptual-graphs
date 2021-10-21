export interface SimpleConcept {
    label: string;
    conceptTypeLabels: string[];
    referent: Referent | string;
}
export class Concept {
    id: string;
    label: string;
    conceptTypeLabels: string[] = [];
    referent: Referent;
}

export class Referent {
    designatorType: DesignatorType;
    designatorValue?: string;
}

export enum DesignatorType {
    BLANK = "BLANK",                            // A blank descriptor which is a blank conceptual graph
    LITERAL = "LITERAL",                        // A syntactic representation of the form of the referent
    CONCEPT_LABEL = "CONCEPT_LABEL",            // Individual Marker: A name of an individual and unique concept in our catalog of concepts
    INDEXICAL = "INDEXICAL",                    // An implementation-defined way of finding the referent
    THE = "THE",                                // Indexical: reference to a previously defined concept
    CONCEPTUAL_GRAPH_LABEL = "CONCEPTUAL_GRAPH_LABEL", // Descriptor: a designator which itself is a conceptual graph
    LAMBDA = "LAMBDA"                           // Used in querying or definitions -> meaning "Any such concept type"
}