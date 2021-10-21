export function isSetOneASubsetOfSetTwo(setA: string[], setB: string[]): boolean {
    let isASubset: boolean = true;
    for (let i = 0; i < setA.length; i++) {
        const singeElement = setA[i];
        if (!setB.includes(singeElement)) {
            isASubset = false;
            break;
        }
    }
    return isASubset;
}