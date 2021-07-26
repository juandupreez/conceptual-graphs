import { RelationType } from "../../main/domain/RelationType";
import { RelationTypeDao } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";

const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao();

describe('RelationTypeDao basic tests', () => {

    it('insert then get relation type', () => {

        const relationType: RelationType = new RelationType();
        relationType.description = "Link";
        const generatedId: string = relationTypeDao.insertRelationTypeAtRoot(relationType);

        const savedRelationType: RelationType = relationTypeDao.getRelationTypeById(generatedId);
        expect(savedRelationType).toEqual({
            ...relationType,
            id: generatedId
        });

    })

    it('insert relation type as child of parent', () => {
        const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao();

        const parentRelationType: RelationType = new RelationType();
        parentRelationType.description = "Link";
        const parentGeneratedId: string = relationTypeDao.insertRelationTypeAtRoot(parentRelationType);

        const subRelationType: RelationType = new RelationType();
        subRelationType.description = "Sub-link";
        const childGeneratedId: string = relationTypeDao.insertRelationTypeAsSubtype(parentRelationType, subRelationType);

        const savedParentRelationType: RelationType = relationTypeDao.getRelationTypeById(parentGeneratedId);
        expect(savedParentRelationType).toEqual({
            ...parentRelationType,
            subRelationTypeIds: [childGeneratedId]
        });

        const savedSubRelationType: RelationType = relationTypeDao.getRelationTypeById(childGeneratedId);
        expect(savedSubRelationType).toEqual({
            ...subRelationType,
            parentRelationTypeIds: [parentGeneratedId]
        });

    })

})