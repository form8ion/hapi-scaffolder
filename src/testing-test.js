import {resolve} from 'path';
import {promises} from 'fs';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import scaffoldTesting from './testing';

suite('testing', () => {
  let sandbox;
  const projectRoot = any.string();
  const pathToCreatedDirectory = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(promises, 'copyFile');
    sandbox.stub(cucumberScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that a canary cucumber test is created when the project will be integration tested', async () => {
    const cucumberDevDependencies = any.listOf(any.word);
    const cucumberScripts = any.simpleObject();
    const cucumberEslintConfigs = any.listOf(any.word);
    mkdir.default
      .withArgs(`${projectRoot}/test/integration/features/step_definitions`)
      .resolves(pathToCreatedDirectory);
    cucumberScaffolder.scaffold
      .withArgs({projectRoot})
      .returns({
        scripts: cucumberScripts,
        devDependencies: cucumberDevDependencies,
        eslintConfigs: cucumberEslintConfigs
      });

    const results = await scaffoldTesting({projectRoot, tests: {integration: true}});

    assert.deepEqual(
      results,
      {
        scripts: cucumberScripts,
        devDependencies: ['@travi/any', 'http-status-codes', ...cucumberDevDependencies],
        eslintConfigs: cucumberEslintConfigs
      }
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'canary.feature'),
      `${pathToCreatedDirectory}/../canary.feature`
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'server-steps.js'),
      `${pathToCreatedDirectory}/server-steps.js`
    );
  });

  test('that no canary test is created when the project will not be integration tested', async () => {
    const results = await scaffoldTesting({tests: {integration: false}});

    assert.deepEqual(results, {devDependencies: []});
    assert.notCalled(mkdir.default);
    assert.notCalled(promises.copyFile);
  });
});
