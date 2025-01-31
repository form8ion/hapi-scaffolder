import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the expected results are returned to the js scaffolder', async function () {
  const {dependencies} = this.result;

  assert.deepEqual(
    dependencies.javascript.production,
    ['@hapi/glue', 'hapi-graceful-shutdown-plugin', 'hapi-pino']
  );
  assert.deepEqual(dependencies.javascript.development, ['webpack', 'webpack-cli']);
});
