import {promises} from 'fs';
import {resolve} from 'path';
import mustache from 'mustache';
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
    sandbox.stub(mustache, 'render');
    sandbox.stub(promises, 'copyFile');
    sandbox.stub(promises, 'writeFile');
    sandbox.stub(promises, 'readFile');
  });

  teardown(() => sandbox.restore());

  test('that source files are scaffolded', async () => {
    const projectName = any.word();
    const templateContent = any.string();
    const renderedContent = any.string();
    mkdir.default.withArgs(`${projectRoot}/src/server`).resolves(pathToCreatedDirectory);
    promises.readFile
      .withArgs(resolve(__dirname, '..', 'templates', 'manifest.mustache'), 'utf8')
      .resolves(templateContent);
    mustache.render
      .withArgs(templateContent, {projectName})
      .returns(renderedContent);

    await scaffoldServer({projectRoot, projectName});

    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'server.mjs'),
      `${pathToCreatedDirectory}/server.js`
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', '.env.example'),
      `${projectRoot}/.env.example`
    );
    assert.calledWith(promises.writeFile, `${pathToCreatedDirectory}/manifest.js`, renderedContent);
    assert.calledWith(promises.writeFile, `${pathToCreatedDirectory}/index.js`, "export {default} from './server';\n");
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'webpack.config.server.mjs'),
      `${projectRoot}/webpack.config.server.babel.js`
    );
  });
});
