import type { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$" : "ts-jest"
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$" : "<rootDir>/src/test/mocks/fileMock.js"
  }
}

export default config;