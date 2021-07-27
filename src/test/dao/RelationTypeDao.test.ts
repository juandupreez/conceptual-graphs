import { RelationType } from "../../main/domain/RelationType";
import { RelationTypeDao, SimpleRelationType } from "../../main/dao/RelationTypeDao";
import { InMemoryRelationTypeDao } from "../../main/dao/inmemory/InMemoryRelationTypeDao";

const relationTypeDao: RelationTypeDao = new InMemoryRelationTypeDao();

describe('RelationTypeDao basic tests', () => {

    it('insert then get relation type', () => {

        const relationType: RelationType = new RelationType();
        relationType.label = "Link1";
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
        parentRelationType.label = "Link2";
        const parentGeneratedId: string = relationTypeDao.insertRelationTypeAtRoot(parentRelationType);

        const subRelationType: RelationType = new RelationType();
        subRelationType.label = "Sub-link";
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
                label: "Link3",
                subRelationTypes: [
                    {
                        label: "RelatedWith",
                        subRelationTypes: [
                            {
                                label: "SiblingOf",
                                subRelationTypes: [
                                    { label: "SisterOf" },
                                    { label: "BrotherOf" }
                                ]
                            }, {
                                label: "AncestorOf",
                                subRelationTypes: [
                                    { 
                                        label: "ParentOf",
                                        subRelationTypes: [
                                            { label: "MotherOf" },
                                            { label: "FatherOf" }
                                        ]
                                    }
                                ]
                            }, {
                                label: "ChildOf"
                            }, {
                                label: "MarriedTo"
                            }
                        ]
                    },
                    {
                        label: "Dislike"
                    },
                    {
                        label: "Like"
                    }
                ]
            }
        ];

        relationTypeDao.generateHierarchyFromObject(hierarchyToGenerate);
        const rootRelationTypes: RelationType[] = relationTypeDao.getRootRelationTypes();
        const linkWithRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Link3");
        expect(rootRelationTypes).toContain(linkWithRelationType);

        const relatedWithRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("RelatedWith");
        const dislikeRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Dislike");
        const likeRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("Like");
        const siblingOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("SiblingOf");
        const ancesterOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("AncestorOf");
        const sisterOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("SisterOf");
        const brotherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("BrotherOf");
        const parentOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("ParentOf");
        const motherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("MotherOf");
        const fatherOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("FatherOf");
        const childOfRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("ChildOf");
        const marriedToRelationType: RelationType = relationTypeDao.getRelationTypeByLabel("MarriedTo");

        // Assert parent ids
        expect(relatedWithRelationType.parentRelationTypeIds[0]).toBe(linkWithRelationType.id);
        expect(dislikeRelationType.parentRelationTypeIds[0]).toBe(linkWithRelationType.id);
        expect(likeRelationType.parentRelationTypeIds[0]).toBe(linkWithRelationType.id);

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
        expect(linkWithRelationType.subRelationTypeIds).toEqual([
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