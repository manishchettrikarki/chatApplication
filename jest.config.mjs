export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/__test__/**/*.ts", "**/?(*.)+(test|spec).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
