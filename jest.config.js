module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
        // "**/test/**/*.+(ts|tsx|js)",

        "**/test/dao/ConceptTypeDao.test.ts",
        "**/test/dao/RelationTypeDao.test.ts",
        "**/test/dao/ConceptDao.test.ts",
        "**/test/dao/RelationDao.test.ts",
        "**/test/dao/ConceptualGraphDao.test.ts",

        "**/test/domain/ConceptualGraph.test.ts",
        "**/test/examples/tutorial.test.ts",
        
        "**/test/query/DBQueryManager_NonNestedQueries.test.ts",
        "**/test/query/CGQueryManager_NonNestedQueries.test.ts",

        // "**/test/rules/SaturationRule.test.ts",
        
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
}