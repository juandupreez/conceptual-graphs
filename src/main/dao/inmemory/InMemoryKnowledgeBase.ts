import { DatabaseQueryManager, ConceptualGraphQueryManager } from "../../conceptual-graphs";
import { ConceptDao } from "../ConceptDao";
import { ConceptTypeDao } from "../ConceptTypeDao";
import { FactDao } from "../FactDao";
import { KnowledgeBase } from "../KnowlegeBase";
import { RelationDao } from "../RelationDao";
import { RelationTypeDao } from "../RelationTypeDao";
import { InMemoryConceptDao } from "./InMemoryConceptDao";
import { InMemoryConceptTypeDao } from "./InMemoryConceptTypeDao";
import { InMemoryFactDao } from "./InMemoryFactDao";
import { InMemoryRelationDao } from "./InMemoryRelationDao";
import { InMemoryRelationTypeDao } from "./InMemoryRelationTypeDao";

export class InMemoryKnowledgeBase implements KnowledgeBase {
    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    factDao: FactDao;

    databaseQueryManager: DatabaseQueryManager;
    conceptualGraphQueryManager: ConceptualGraphQueryManager;

    constructor() {
        this.conceptTypeDao = new InMemoryConceptTypeDao();
        this.relationTypeDao = new InMemoryRelationTypeDao(this.conceptTypeDao);
        this.conceptDao = new InMemoryConceptDao(this.conceptTypeDao);
        this.relationDao = new InMemoryRelationDao(this.conceptDao, this.conceptTypeDao, this.relationTypeDao);
        this.factDao = new InMemoryFactDao(this.conceptDao, this.relationDao);

        this.databaseQueryManager = new DatabaseQueryManager(this.conceptDao, this.relationDao);
        this.conceptualGraphQueryManager = new ConceptualGraphQueryManager(this.conceptTypeDao, this.relationTypeDao);
    }

}