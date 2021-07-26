import { RelationType } from "../../main/domain/RelationType";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
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

    it('Generate concept type hierarchy from JSON structure', () => {   
        const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao();
        const hierarchyToGenerate: SimpleRelationType[] = [
            {
                description: "Link",
                subRelationTypes: [
                    {
                        description: "RelatedWith",
                        subRelationTypes: [
                            {
                                description: "SiblingOf",
                                subRelationTypes: [
                                    { description: "SisterOf" },
                                    { description: "BrotherOf" }
                                ]
                            }, {
                                description: "AncestorOf",
                                subRelationTypes: [
                                    { 
                                        description: "ParentOf",
                                        subRelationTypes: [
                                            { description: "MotherOf" },
                                            { description: "FatherOf" }
                                        ]
                                    }
                                ]
                            }, {
                                description: "ChildOf"
                            }, {
                                description: "MarriedTo"
                            }
                        ]
                    },
                    {
                        description: "Dislike"
                    },
                    {
                        description: "Like"
                    }
                ]
            }
        ];

        relationTypeDao.generateHierarchyFromObject(hierarchyToGenerate);
        const rootRelationTypes: RelationType[] = relationTypeDao.getRootRelationTypes();
        expect(rootRelationTypes.length).toBe(1);
        expect(rootRelationTypes[0].description).toBe("Link");

        const relatedWithRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("RelatedWith");
        const dislikeRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("Dislike");
        const likeRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("Like");
        const siblingOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("SiblingOf");
        const ancesterOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("AncestorOf");
        const sisterOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("SisterOf");
        const brotherOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("BrotherOf");
        const parentOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("ParentOf");
        const motherOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("MotherOf");
        const fatherOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("FatherOf");
        const childOfRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("ChildOf");
        const marriedToRelationType: RelationType = relationTypeDao.getRelationTypeByDescription("MarriedTo");

        // Assert parent ids
        expect(relatedWithRelationType.parentRelationTypeIds[0]).toBe(rootRelationTypes[0].id);
        expect(dislikeRelationType.parentRelationTypeIds[0]).toBe(rootRelationTypes[0].id);
        expect(likeRelationType.parentRelationTypeIds[0]).toBe(rootRelationTypes[0].id);

        expect(siblingOfRelationType.parentRelationTypeIds[0]).toBe(relatedWithRelationType.id);
        expect(ancesterOfRelationType.parentRelationTypeIds[0]).toBe(relatedWithRelationType.id);
        expect(childOfRelationType.parentRelationTypeIds[0]).toBe(relatedWithRelationType.id);
        expect(marriedToRelationType.parentRelationTypeIds[0]).toBe(relatedWithRelationType.id);

        expect(sisterOfRelationType.parentRelationTypeIds[0]).toBe(siblingOfRelationType.id);
        expect(brotherOfRelationType.parentRelationTypeIds[0]).toBe(siblingOfRelationType.id);
        expect(parentOfRelationType.parentRelationTypeIds[0]).toBe(ancesterOfRelationType.id);
        expect(motherOfRelationType.parentRelationTypeIds[0]).toBe(parentOfRelationType.id);
        expect(fatherOfRelationType.parentRelationTypeIds[0]).toBe(parentOfRelationType.id);
        
        // Assert sub ids
        expect(rootRelationTypes[0].subRelationTypeIds).toEqual([
            relatedWithRelationType.id, dislikeRelationType.id, likeRelationType.id
        ]);
        expect(relatedWithRelationType.subRelationTypeIds).toEqual([
            siblingOfRelationType.id, ancesterOfRelationType.id, childOfRelationType.id, marriedToRelationType.id
        ]);
        expect(siblingOfRelationType.subRelationTypeIds).toEqual([sisterOfRelationType.id, brotherOfRelationType.id]);
        expect(ancesterOfRelationType.subRelationTypeIds).toEqual([parentOfRelationType.id]);
        expect(parentOfRelationType.subRelationTypeIds).toEqual([motherOfRelationType.id, fatherOfRelationType.id]);

    })

})