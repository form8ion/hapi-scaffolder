import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import deepmerge from 'deepmerge';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import scaffoldTesting from './testing.js';

vi.mock('node:fs');
vi.mock('deepmerge');
vi.mock('@form8ion/cucumber-scaffolder');

describe('testing scaffolder', () => {
  const projectRoot = any.string();

  it('should create a canary cucumber test when the project will be integration tested', async () => {
    const cucumberResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(scaffoldCucumber).calledWith({projectRoot}).thenReturn(cucumberResults);
    when(deepmerge)
      .calledWith({dependencies: {javascript: {development: ['@travi/any', 'http-status-codes']}}}, cucumberResults)
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({projectRoot, tests: {integration: true}})).toEqual(mergedResults);
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'canary.feature'),
      `${projectRoot}/test/integration/features/canary.feature`
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'server-steps.js'),
      `${projectRoot}/test/integration/features/step_definitions/server-steps.js`
    );
  });

  it('should not create a canary test when the project will not be integration tested', async () => {
    expect(await scaffoldTesting({tests: {integration: false}})).toEqual({});

    expect(fs.copyFile).not.toHaveBeenCalled();
    expect(fs.mkdir).not.toHaveBeenCalled();
  });
});
