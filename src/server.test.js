import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import mustache from 'mustache';

import any from '@travi/any';
import {describe, it, vi, expect} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import scaffoldServer from './server.js';

vi.mock('node:fs');
vi.mock('mustache');

describe('server scaffolder', () => {
  it('should scaffold server source files', async () => {
    const projectRoot = any.string();
    const projectName = any.word();
    const manifestTemplate = any.string();
    const renderedManifest = any.string();
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'manifest.mustache'), 'utf8')
      .thenResolve(manifestTemplate);
    when(mustache.render).calledWith(manifestTemplate, {projectName}).thenReturn(renderedManifest);

    await scaffoldServer({projectRoot, projectName});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/src/server`, {recursive: true});
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'server.mjs'),
      `${projectRoot}/src/server/server.js`
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', '.env.example'),
      `${projectRoot}/.env.example`
    );
    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/src/server/manifest.js`, renderedManifest);
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/src/server/index.js`,
      "export {default} from './server.js';\n"
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'webpack.config.server.mjs'),
      `${projectRoot}/webpack.config.server.babel.js`
    );
  });
});
