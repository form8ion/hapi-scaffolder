import {resolve} from 'path';
import {promises} from 'fs';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, tests}) {
  if (tests.integration) {
    const stepDefinitionsDirectory = await mkdir(`${projectRoot}/test/integration/features/step_definitions`);

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
  }

  return {
    devDependencies: [...tests.integration ? ['http-status-codes'] : []]
  };
}
