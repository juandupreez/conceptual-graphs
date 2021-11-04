import { ConceptualGraphQueryManager, DatabaseQueryManager } from "../conceptual-graphs";
import { ConceptDao } from "./ConceptDao";
import { ConceptTypeDao } from "./ConceptTypeDao";
import { FactDao } from "./FactDao";
import { RelationDao } from "./RelationDao";
import { RelationTypeDao } from "./RelationTypeDao";

export interface KnowledgeBase {

    conceptTypeDao: ConceptTypeDao;
    relationTypeDao: RelationTypeDao;
    conceptDao: ConceptDao;
    relationDao: RelationDao;
    factDao: FactDao;

    databaseQueryManager: DatabaseQueryManager;
    conceptualGraphQueryManager: ConceptualGraphQueryManager;

}