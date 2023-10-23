import deepmerge from 'deepmerge';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as serverScaffolder from './server.js';
import * as documentationScaffolder from './documentation.js';
import * as testingScaffolder from './testing.js';
import {scaffold} from './scaffolder.js';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(deepmerge, 'all');
    sandbox.stub(serverScaffolder, 'default');
    sandbox.stub(documentationScaffolder, 'default');
    sandbox.stub(testingScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the hapi details are scaffolded', async () => {
    const documentation = any.simpleObject();
    const tests = any.simpleObject();
    const projectName = any.word();
    const testingDevDependencies = any.listOf(any.string);
    const testingResults = {...any.simpleObject(), devDependencies: testingDevDependencies};
    documentationScaffolder.default.returns(documentation);
    testingScaffolder.default.withArgs({tests, projectRoot}).resolves(testingResults);
    const mergedResults = any.simpleObject();
    deepmerge.all
      .withArgs([
        {
          dependencies: [
            '@hapi/glue',
            '@hapi/good',
            'hapi-graceful-shutdown-plugin',
            'dotenv-safe',
            'good-bunyan',
            'bunyan'
          ],
          devDependencies: ['webpack', 'webpack-cli'],
          scripts: {
            build: 'npm-run-all --print-label --parallel build:*',
            'build:server': 'webpack --env production --config webpack.config.server.babel.js',
            start: 'node ./lib/server',
            'pretest:integration': 'run-s build'
          },
          documentation
        },
        testingResults
      ])
      .returns(mergedResults);

    assert.equal(await scaffold({projectRoot, projectName, tests}), mergedResults);
    assert.calledWith(serverScaffolder.default, {projectRoot, projectName});
  });
});
