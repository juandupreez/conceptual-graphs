import { ConceptualGraph } from "../conceptual-graphs";

export function doesConceptualGraphAContainAllNodesOfConceptualGraphB(conceptualGraphA: ConceptualGraph,
    conceptualGraphB: ConceptualGraph): boolean {
    const areConceptsASubset: boolean = isSetOneASubsetOfSetTwo(conceptualGraphA.concepts, conceptualGraphB.concepts);
    if (areConceptsASubset) {
        return isSetOneASubsetOfSetTwo(conceptualGraphA.relations, conceptualGraphB.relations);
    } else {
        return false;
    }
}


function isSetOneASubsetOfSetTwo(setA: any[], setB: any[]): boolean {
    if (!setA || !setB) {
        return false;
    }
    const setBInStrings: string[] = setB.map((singleSetBElement) => {
        return JSON.stringify(singleSetBElement);
    })
    let isASubset: boolean = true;
    for (let i = 0; i < setA.length; i++) {
        const singleElement = setA[i];
        if (!setBInStrings.includes(JSON.stringify(singleElement))) {
            isASubset = false;
            break;
        }
    }
    return isASubset;
}