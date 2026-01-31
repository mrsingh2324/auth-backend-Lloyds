module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "routes/**/*.js",
    "middleware/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
  ],
  verbose: true,
  testTimeout: 10000,
};
