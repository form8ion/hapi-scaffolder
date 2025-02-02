import {dirname, resolve} from 'node:path';
import {promises as fs} from 'node:fs';
import {fileURLToPath} from 'node:url';
import deepmerge from 'deepmerge';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function ({projectRoot, tests}) {
  if (tests.integration) {
    await fs.mkdir(`${projectRoot}/test/integration/features/step_definitions`, {recursive: true});

    const [cucumberResults] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      fs.copyFile(
        resolve(__dirname, '..', 'templates', 'canary.feature'),
        `${projectRoot}/test/integration/features/canary.feature`
      ),
      fs.copyFile(
        resolve(__dirname, '..', 'templates', 'server-steps.js'),
        `${projectRoot}/test/integration/features/step_definitions/server-steps.js`
      )
    ]);

    return deepmerge(
      {dependencies: {javascript: {development: ['@travi/any', 'http-status-codes']}}},
      cucumberResults
    );
  }

  return {};
}
