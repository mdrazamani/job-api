import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../tsconfig.json';

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../',
    testRegex: 'test/.*\\.e2e-spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/src/'
    }),
    testEnvironment: 'node'
};
