import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import stubbedFs from 'mock-fs';
import {Before, When} from '@cucumber/cucumber';

import {scaffold} from '../../../../src/index.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectPath = [__dirname, '..', '..', '..', '..'];

Before(async function () {
  this.projectRoot = process.cwd();

  stubbedFs({
    templates: stubbedFs.load(resolve(...projectPath, 'templates'))
  });
});

When('the project is scaffolded', async function () {
  this.result = await scaffold({projectRoot: this.projectRoot, tests: {}});
});
