import {resolve} from 'path';
import {promises} from 'fs';
import deepmerge from 'deepmerge';

import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

import mkdir from '../thirdparty-wrappers/make-dir.js';

export default async function ({projectRoot, tests}) {
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

    return deepmerge.all([
      {devDependencies: ['@travi/any', 'http-status-codes']},
      cucumberResults
    ]);
  }

  return {};
}
