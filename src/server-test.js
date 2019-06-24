import {promises} from 'fs';
import {resolve} from 'path';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import scaffoldServer from './server';

suite('server', () => {
  let sandbox;
  const pathToCreatedDirectory = any.string();
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(promises, 'copyFile');
    sandbox.stub(promises, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that source files are scaffolded', async () => {
    mkdir.default.withArgs(`${projectRoot}/src/server`).resolves(pathToCreatedDirectory);

    await scaffoldServer({projectRoot});

    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'server.js'),
      `${pathToCreatedDirectory}/server.js`
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'manifest.js'),
      `${pathToCreatedDirectory}/manifest.js`
    );
    assert.calledWith(
      promises.writeFile,
      `${pathToCreatedDirectory}/index.js`,
      "export {default} from './server';"
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'webpack.config.server.js'),
      `${projectRoot}/webpack.config.server.babel.js`
    );
  });
});
