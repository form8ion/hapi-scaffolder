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
  const packageName = any.word();

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

    const results = await scaffoldTesting({projectRoot, packageName, tests: {integration: true}});

    assert.deepEqual(
      results,
      {
        scripts: {'lint:engines': 'check-engine', ...cucumberScripts},
        devDependencies: ['check-engine', '@travi/any', 'http-status-codes', ...cucumberDevDependencies],
        eslintConfigs: cucumberEslintConfigs,
        packageProperties: {engines: {node: '12.x.x'}},
        badges: {
          consumer: {
            node: {
              img: `https://img.shields.io/node/v/${packageName}.svg`,
              text: 'node'
            }
          }
        }
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
    const results = await scaffoldTesting({tests: {integration: false}, packageName});

    assert.deepEqual(
      results,
      {
        devDependencies: ['check-engine'],
        packageProperties: {engines: {node: '12.x.x'}},
        scripts: {'lint:engines': 'check-engine'},
        badges: {
          consumer: {
            node: {
              img: `https://img.shields.io/node/v/${packageName}.svg`,
              text: 'node'
            }
          }
        }
      }
    );
    assert.notCalled(mkdir.default);
    assert.notCalled(promises.copyFile);
  });
});
