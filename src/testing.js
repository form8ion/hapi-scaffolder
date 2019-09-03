import {resolve} from 'path';
import {promises} from 'fs';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, tests}) {
  if (tests.integration) {
    const featuresDirectory = await mkdir(`${projectRoot}/test/integration/features`);

    await Promise.all([
      promises.copyFile(
        resolve(__dirname, '..', 'templates', 'canary.feature'),
        `${featuresDirectory}/canary.feature`
      ),
      promises.copyFile(
        resolve(__dirname, '..', 'templates', 'server-steps.js'),
        `${featuresDirectory}/step_definitions/server-steps.js`
      )
    ]);
  }

  return {
    devDependencies: [...tests.integration ? ['http-status-codes'] : []]
  };
}
