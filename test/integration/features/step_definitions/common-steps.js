import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import stubbedFs from 'mock-fs';
import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';

// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {scaffold} from '@form8ion/hapi-scaffolder';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectPath = [__dirname, '..', '..', '..', '..'];

Before(async function () {
  this.projectRoot = process.cwd();

  stubbedFs({
    node_modules: stubbedFs.load(resolve(...projectPath, 'node_modules')),
    templates: stubbedFs.load(resolve(...projectPath, 'templates')),
    'package.json': JSON.stringify(any.simpleObject())
  });
});

After(() => {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  this.result = await scaffold({
    projectRoot: this.projectRoot,
    tests: {
      ...this.integrationTests && {integration: this.integrationTests}
    }
  });
});
