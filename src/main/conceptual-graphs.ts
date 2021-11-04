// Domain
import { ConceptType, SimpleConceptType } from "./domain/ConceptType";;
import { RelationType, SimpleRelationType } from "./domain/RelationType";
import { Concept, SimpleConcept, Referent, DesignatorType } from "./domain/Concept";
import { Relation, SimpleRelation } from "./domain/Relation";
import { ConceptualGraph, ConceptualGraphSkeleton } from "./domain/ConceptualGraph";

// Dao Interfaces
import { ConceptTypeDao, NoSuchConceptTypeError, UniqueConceptTypeViolationError } from "./dao/ConceptTypeDao";
import { RelationTypeDao, NoSuchRelationTypeError, UniqueRelationTypeViolationError } from "./dao/RelationTypeDao";
import { ConceptDao } from "./dao/ConceptDao";
import { RelationDao } from "./dao/RelationDao";
import { FactDao } from "./dao/FactDao";
import { KnowledgeBase } from "./dao/KnowlegeBase";

// In-Memory Daos
import { InMemoryConceptTypeDao } from "./dao/inmemory/InMemoryConceptTypeDao";
import { InMemoryRelationTypeDao } from "./dao/inmemory/InMemoryRelationTypeDao";
import { InMemoryConceptDao } from "./dao/inmemory/InMemoryConceptDao";
import { InMemoryRelationDao } from "./dao/inmemory/InMemoryRelationDao";
import { InMemoryFactDao } from "./dao/inmemory/InMemoryFactDao";
import { InMemoryKnowledgeBase } from "./dao/inmemory/InMemoryKnowledgeBase";

// Utils
import { isConcept, hasConceptType, hasAnyConceptTypes, conceptToString, cloneConcept, createConcept } from "./util/ConceptUtil";
import { relationToString, cloneRelation, createRelation } from "./util/RelationUtil";

// Query
import { QueryManager } from "./query/QueryManager";
import { DatabaseQueryManager } from "./query/DatabaseQueryManager";
import { ConceptualGraphQueryManager } from "./query/ConceptualGraphQueryManager";

// Rule
import { Rule, RuleType } from "./rules/Rule";
import { SaturationRule } from "./rules/SaturationRule";
import { ExtractionRule } from "./rules/ExtractionRule";

// Operation
import { Operation } from "./operations/Operation";
import { SaturationOperation } from "./operations/SaturationOperation";
import { ExtractionOperation } from "./operations/ExtractionOperation";
import { KBQuerySaturationOperation } from "./operations/KBQuerySaturationOperation";

export { ConceptType, SimpleConceptType };
export { RelationType, SimpleRelationType };
export { Concept, SimpleConcept, Referent, DesignatorType };
export { Relation, SimpleRelation };
export { ConceptualGraph, ConceptualGraphSkeleton };
export { ConceptTypeDao, NoSuchConceptTypeError, UniqueConceptTypeViolationError };
export { RelationTypeDao, NoSuchRelationTypeError, UniqueRelationTypeViolationError };
export { ConceptDao };
export { RelationDao };
export { FactDao };
export { KnowledgeBase };
export { InMemoryConceptTypeDao };
export { InMemoryRelationTypeDao };
export { InMemoryConceptDao };
export { InMemoryRelationDao };
export { InMemoryFactDao };
export { InMemoryKnowledgeBase }
export { isConcept, hasConceptType, hasAnyConceptTypes, conceptToString, cloneConcept, createConcept };
export { relationToString, cloneRelation, createRelation };
export { QueryManager };
export { DatabaseQueryManager };
export { ConceptualGraphQueryManager };
export { Rule, RuleType };
export { SaturationRule };
export { ExtractionRule };
export { Operation };
export { SaturationOperation };
export { ExtractionOperation };
export { KBQuerySaturationOperation };
