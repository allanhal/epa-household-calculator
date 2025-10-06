export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^\./routes/(.*)\\.js$': './routes/$1.ts',
    '^\./config/(.*)\\.js$': './config/$1.ts',
    '^\./controllers/(.*)\\.js$': './controllers/$1.ts',
    '^\./utils/(.*)\\.js$': './utils/$1.ts',
    '^\./services/(.*)\\.js$': './services/$1.ts',
    '^\./types\\.js$': './types.ts',
    '^\.\./config/(.*)\\.js$': '../config/$1.ts',
    '^\.\./controllers/(.*)\\.js$': '../controllers/$1.ts',
    '^\.\./utils/(.*)\\.js$': '../utils/$1.ts',
    '^\.\./services/(.*)\\.js$': '../services/$1.ts',
    '^\.\./types\\.js$': '../types.ts',
    '^\.\.\/\.\.\/src\/(.*)\\.js$': '<rootDir>/src/$1.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s'],
};
