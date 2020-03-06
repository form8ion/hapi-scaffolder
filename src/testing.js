import {resolve} from 'path';
import {promises} from 'fs';
import deepmerge from 'deepmerge';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, packageName, tests}) {
  const commonResults = {
    devDependencies: ['check-engine'],
    scripts: {'lint:engines': 'check-engine'},
    badges: {
      consumer: {
        node: {
          img: `https://img.shields.io/node/v/${packageName}.svg`,
          text: 'node'
        }
      }
    },
    packageProperties: {engines: {node: '12.x.x'}}
  };

  if (tests.integration) {
    const [stepDefinitionsDirectory, cucumberResults] = await Promise.all([
      mkdir(`${projectRoot}/test/integration/features/step_definitions`),
      scaffoldCucumber({projectRoot})
    ]);

    await Promise.all([
      promises.copyFile(
        resolve(__dirname, '..', 'templates', 'canary.feature'),
        `${stepDefinitionsDirectory}/../canary.feature`
      ),
      promises.copyFile(
        resolve(__dirname, '..', 'templates', 'server-steps.js'),
        `${stepDefinitionsDirectory}/server-steps.js`
      )
    ]);

    return deepmerge(
      commonResults,
      {
        scripts: cucumberResults.scripts,
        devDependencies: ['@travi/any', 'http-status-codes', ...cucumberResults.devDependencies],
        eslintConfigs: cucumberResults.eslintConfigs
      }
    );
  }

  return commonResults;
}
