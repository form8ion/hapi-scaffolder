import {resolve} from 'path';
import {promises as fsPromises} from 'fs';
import stubbedFs from 'mock-fs';
import {Before, Then, When} from '@cucumber/cucumber';
import {scaffold} from '../../../../src';

const {readFile} = fsPromises;

Before(async function () {
  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  stubbedFs({
    templates: {
      '.env.example': await readFile(resolve(__dirname, '../../../../', 'templates/.env.example')),
      'server.js': await readFile(resolve(__dirname, '../../../../', 'templates/server.js')),
      'manifest.mustache': await readFile(resolve(__dirname, '../../../../', 'templates/manifest.mustache'))
    }
  });
});

When('the project is scaffolded', async function () {
  await scaffold({projectRoot: process.cwd(), tests: {}});
});

Then('the expected files are generated', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the expected results are returned to the js scaffolder', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
