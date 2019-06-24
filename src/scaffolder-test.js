import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as serverScaffolder from './server';
import {scaffold} from './scaffolder';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(serverScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the hapi details are scaffolded', async () => {
    assert.deepEqual(
      await scaffold({projectRoot}),
      {
        dependencies: [
          '@hapi/glue',
          'hapi-graceful-shutdown-plugin'
        ],
        devDependencies: [
          'webpack',
          'webpack-cli'
        ],
        scripts: {
          build: 'npm-run-all --print-label --parallel build:*',
          'build:server': 'webpack --env production --config webpack.config.server.babel.js',
          start: 'node ./lib/server'
        }
      }
    );
    assert.calledWith(serverScaffolder.default, {projectRoot});
  });
});
