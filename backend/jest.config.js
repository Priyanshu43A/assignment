export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
