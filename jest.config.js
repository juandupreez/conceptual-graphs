module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
        // "**/test/**/*.+(ts|tsx|js)",

        "**/test/dao/ConceptTypeDao.test.ts",
        "**/test/dao/RelationTypeDao.test.ts",
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
}