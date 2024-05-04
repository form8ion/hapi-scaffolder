import {resolve} from 'node:path';
import {fileExists} from '@form8ion/core';

import stubbedFs from 'mock-fs';
import {Before, Then, When} from '@cucumber/cucumber';
import {assert} from 'chai';

import {scaffold} from '../../../../src/index.js';

const projectPath = [__dirname, '..', '..', '..', '..'];

Before(async function () {
  this.projectRoot = process.cwd();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  stubbedFs({
    templates: stubbedFs.load(resolve(...projectPath, 'templates'))
  });
});

When('the project is scaffolded', async function () {
  this.result = await scaffold({projectRoot: this.projectRoot, tests: {}});
});

Then('the expected files are generated', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/index.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/server.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/manifest.js`));
});

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
