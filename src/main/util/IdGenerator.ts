export class IdGenerator {

    static instance: IdGenerator;
    curConceptTypeId: number = 1;
    curRelationTypeId: number = 1;
    curConceptId: number = 1;
    curRelationId: number = 1;
    curConceptualGraphId: number = 1;
    curTestId: number = 1;

    static getInstance(): IdGenerator {
        if (!this.instance) {
            this.instance = new IdGenerator();
        }
        return this.instance;
    }

    getNextUniqueConceptTypeId(): string {
        const curConceptTypeId: number = this.curConceptTypeId++;
        return curConceptTypeId.toString();
    }

    getNextUniqueRelationTypeId() {
        const curRelationTypeId: number = this.curRelationTypeId++;
        return curRelationTypeId.toString();
    }

    getNextUniqueConceptId() {
        const curConceptId: number = this.curConceptId++;
        return curConceptId.toString();
    }

    getNextUniqueRelationId() {
        const curRelationId: number = this.curRelationId++;
        return curRelationId.toString();
    }
    
    getNextUniqueConceptualGraphId(): string {
        const curConceptualGraphId: number = this.curConceptualGraphId++;
        return curConceptualGraphId.toString();
    }
    
    getNextUniquTestId(): string {
        const curTestId: number = this.curTestId++;
        return curTestId.toString();
    }

}