/* eslint-disable no-dupe-keys */
/** @type {import('jest').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/',
    ],
  };
  