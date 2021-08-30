import { ConceptDao } from "../dao/ConceptDao";
import { RelationDao } from "../dao/RelationDao";
import { Concept } from "../domain/Concept";
import { ConceptualGraph } from "../domain/ConceptualGraph";
import { Relation } from "../domain/Relation";
import { QueryManager } from "./QueryManager";

export class DatabaseQueryManager extends QueryManager {
    conceptDao: ConceptDao;
    relationDao: RelationDao;

    constructor(conceptDao: ConceptDao, relationDao: RelationDao) {
        super();
        this.conceptDao = conceptDao;
        this.relationDao = relationDao;
    }

    protected _matchNodes(queryNode: Concept | Relation, previousMatchedNode: Concept | Relation, query: ConceptualGraph,
        positionInRelationArguments: number): (Concept | Relation)[] {
        if ((queryNode as any).conceptTypeLabels) {
            const matchedConcepts: Concept[] = this.conceptDao.getConceptsByExample(queryNode as Concept);
            if (previousMatchedNode) {
                return matchedConcepts.filter((singleMatchedConcept) => {
                    const doesPreviousRelationMatch: boolean = positionInRelationArguments !== -1 ?
                        (previousMatchedNode as Relation).conceptArgumentLabels[positionInRelationArguments] === singleMatchedConcept.label :
                        ((previousMatchedNode as Relation).conceptArgumentLabels.includes(singleMatchedConcept.label));
                    return doesPreviousRelationMatch;
                }) ?? [];
            } else {
                return matchedConcepts;
            }
        } else {
            const matchedRelations: Relation[] = this.relationDao.getRelationsByExample(queryNode as Relation, query);
            return matchedRelations.filter((singleMatchedRelation) => {
                const doesPreviousConceptMatch: boolean = positionInRelationArguments !== -1 ?
                    singleMatchedRelation.conceptArgumentLabels[positionInRelationArguments] === previousMatchedNode.label :
                    singleMatchedRelation.conceptArgumentLabels.includes(previousMatchedNode.label);
                return doesPreviousConceptMatch;
            }) ?? [];
        }
    }
}