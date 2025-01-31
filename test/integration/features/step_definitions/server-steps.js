import {fileExists} from '@form8ion/core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the expected files are generated', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/index.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/server.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/manifest.js`));
});
