import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldTesting from './testing';

suite('testing', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => sandbox.restore());

  test('that a canary cucumber test is created when the project will be integration tested', async () => {
    const results = await scaffoldTesting({tests: {integration: true}});

    assert.deepEqual(results.devDependencies, ['http-status-codes']);
  });

  test('that no canary test is created when the project will not be integration tested', async () => {
    const results = await scaffoldTesting({tests: {integration: false}});

    assert.deepEqual(results, {devDependencies: []});
  });
});
