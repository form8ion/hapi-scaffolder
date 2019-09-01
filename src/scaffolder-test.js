import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as serverScaffolder from './server';
import * as documentationScaffolder from './documentation';
import {scaffold} from './scaffolder';

suite('scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(serverScaffolder, 'default');
    sandbox.stub(documentationScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the hapi details are scaffolded', async () => {
    const documentation = any.simpleObject();
    documentationScaffolder.default.returns(documentation);

    assert.deepEqual(
      await scaffold({projectRoot}),
      {
        dependencies: [
          '@hapi/glue',
          '@hapi/good',
          '@hapi/good-squeeze',
          '@hapi/good-console',
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
        },
        documentation
      }
    );
    assert.calledWith(serverScaffolder.default, {projectRoot});
  });
});
