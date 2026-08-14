/** @type {import('jest').Config} Gives this object Jest autocomplete and validation. */
const config = {
  // Transform TypeScript tests and execute them as ES modules.
  preset: 'ts-jest/presets/default-esm',

  // Run tests in Node instead of a browser-like DOM.
  testEnvironment: 'node',

  // Treat .ts files as ES modules during testing.
  extensionsToTreatAsEsm: ['.ts'],

  // Search for tests only inside this package's source directory.
  roots: ['<rootDir>/src'],

  // Run files whose names end with .test.ts.
  testMatch: ['**/*.test.ts'],

  // Map ESM's .js import paths back to .ts source files during tests.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Reset mocks between tests so tests cannot affect one another.
  clearMocks: true,
};

// Export the Jest configuration using ES module syntax.
export default config;
