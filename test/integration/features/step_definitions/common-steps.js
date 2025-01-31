import {resolve} from 'node:path';

import stubbedFs from 'mock-fs';
import {Before, When} from '@cucumber/cucumber';

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
