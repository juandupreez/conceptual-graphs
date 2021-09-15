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
    quantifierType: QuantifierType;
    quantifierValue?: string;
    designatorType: DesignatorType;
    designatorValue?: string;
}

export enum QuantifierType {
    A_SINGLE = "A_SINGLE",                      // Existential Quantifier: (backwards E) There exists a. Also noted by a blank. Default
    ALL = "ALL",                                // Universal Quantifier: (Upside down A) For all x     
    SOME = "SOME",                              // Unspecified Set: a set of things, but we don't know how many. Always more than one
    SPECIFIC_QUANTITY = "SPECIFIC_QUANTITY",    // Defines a quantity such as "2 legs" or "40 guests". Requires something in the quantity value
    // COLLECTION_OF_CONCEPTS = "COLLECTION_OF_CONCEPTS"   // Collection of concept labels separated by commas
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