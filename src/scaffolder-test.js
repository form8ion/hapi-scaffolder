import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as serverScaffolder from './server';
import * as documentationScaffolder from './documentation';
import * as testingScaffolder from './testing';
import {scaffold} from './scaffolder';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

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
    testingScaffolder.default.withArgs({tests}).resolves(testingResults);

    assert.deepEqual(
      await scaffold({projectRoot, projectName, tests}),
      {
        dependencies: [
          '@hapi/glue',
          '@hapi/good',
          'hapi-graceful-shutdown-plugin',
          'good-bunyan',
          'bunyan'
        ],
        devDependencies: [
          'webpack',
          'webpack-cli',
          ...testingDevDependencies
        ],
        scripts: {
          build: 'npm-run-all --print-label --parallel build:*',
          'build:server': 'webpack --env production --config webpack.config.server.babel.js',
          start: 'node ./lib/server'
        },
        documentation
      }
    );
    assert.calledWith(serverScaffolder.default, {projectRoot, projectName});
  });
});
