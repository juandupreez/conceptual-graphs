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

})