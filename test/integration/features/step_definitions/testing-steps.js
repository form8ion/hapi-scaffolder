import {fileExists} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('the project will be integration tested', async function () {
  this.integrationTests = true;
});

Given('the project will not be integration tested', async function () {
  this.integrationTests = false;
});

Then('cucumber is configured', async function () {
  const developmentDependencies = this.result.dependencies.javascript.development;

  assert.isTrue(await fileExists(`${process.cwd()}/test/integration/features/canary.feature`));
  assert.isTrue(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/server-steps.js`));

  assert.include(developmentDependencies, '@cucumber/cucumber');
  assert.include(developmentDependencies, '@travi/any');
  assert.include(developmentDependencies, 'http-status-codes');
});

Then('cucumber is not configured', async function () {
  const developmentDependencies = this.result.dependencies.javascript.development;

  assert.isFalse(await fileExists(`${process.cwd()}/test/integration/features/canary.feature`));
  assert.isFalse(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/server-steps.js`));

  assert.notInclude(developmentDependencies, '@cucumber/cucumber');
  assert.notInclude(developmentDependencies, '@travi/any');
  assert.notInclude(developmentDependencies, 'http-status-codes');
});
