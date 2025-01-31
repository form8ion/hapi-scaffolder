import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the expected results are returned to the js scaffolder', async function () {
  assert.deepEqual(
    this.result.dependencies,
    [
      '@hapi/glue',
      'hapi-graceful-shutdown-plugin',
      'hapi-pino'
    ]
  );
});
