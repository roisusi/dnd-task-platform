/** @type {import('jest').Config} Gives this object Jest autocomplete and validation. */
const config = {
  // Transform TypeScript tests using Jest's standard TypeScript preset.
  preset: 'ts-jest',

  // Run tests in Node instead of a browser-like DOM.
  testEnvironment: 'node',

  // Search for tests only inside this package's source directory.
  roots: ['<rootDir>/src'],

  // Run files whose names end with .test.ts.
  testMatch: ['**/*.test.ts'],

  // Reset mocks between tests so tests cannot affect one another.
  clearMocks: true,
};

// Export the Jest configuration in the format Jest loads by default.
module.exports = config;
