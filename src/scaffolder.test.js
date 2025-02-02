import deepmerge from 'deepmerge';

import any from '@travi/any';
import {expect, it, vi, describe} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import scaffoldServer from './server.js';
import scaffoldDocumentation from './documentation.js';
import scaffoldTesting from './testing.js';
import {scaffold} from './scaffolder.js';

vi.mock('deepmerge');
vi.mock('./server.js');
vi.mock('./documentation.js');
vi.mock('./testing.js');

describe('scaffolder', () => {
  it('should scaffold the hapi details', async () => {
    const projectRoot = any.string();
    const projectName = any.word();
    const tests = any.simpleObject();
    const documentation = any.simpleObject();
    const testingResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(scaffoldTesting).calledWith({projectRoot, tests}).thenResolve(testingResults);
    when(scaffoldDocumentation).calledWith().thenReturn(documentation);
    when(deepmerge)
      .calledWith(
        {
          dependencies: {
            javascript: {
              production: ['@hapi/glue', 'hapi-graceful-shutdown-plugin', 'hapi-pino'],
              development: ['webpack', 'webpack-cli']
            }
          },
          scripts: {
            build: 'npm-run-all --print-label --parallel build:*',
            'build:server': 'webpack --env production --config webpack.config.server.babel.js',
            start: 'node ./lib/server',
            'pretest:integration': 'run-s build'
          },
          documentation
        },
        testingResults
      )
      .thenReturn(mergedResults);

    expect(await scaffold({projectRoot, projectName, tests})).toEqual(mergedResults);
    expect(scaffoldServer).toHaveBeenCalledWith({projectRoot, projectName});
  });
});
