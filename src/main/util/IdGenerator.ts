export class IdGenerator {

    static instance: IdGenerator;
    curConceptTypeId: number = 1;

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

}