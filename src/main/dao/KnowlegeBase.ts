import { ConceptualGraphQueryManager, ConceptualGraphSkeleton, DatabaseQueryManager, SimpleConceptType, SimpleRelationType } from "../conceptual-graphs";
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

    importConceptTypeHierarchy(conceptTypeHierarchy: SimpleConceptType[]): void;
    importRelationTypeHierarchy(relationTypeHierarchy: SimpleRelationType[]): void;
    importFacts(conceptTypeHierarchy: ConceptualGraphSkeleton[]): void;

}