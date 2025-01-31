import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import mustache from 'mustache';

export default async function ({projectRoot, projectName}) {
  await fs.mkdir(`${projectRoot}/src/server`, {recursive: true});

  await Promise.all([
    fs.copyFile(resolve(__dirname, '..', 'templates', 'server.mjs'), `${projectRoot}/src/server/server.js`),
    fs.copyFile(resolve(__dirname, '..', 'templates', '.env.example'), `${projectRoot}/.env.example`),
    fs.writeFile(
      `${projectRoot}/src/server/manifest.js`,
      mustache.render(
        await fs.readFile(resolve(__dirname, '..', 'templates', 'manifest.mustache'), 'utf8'),
        {projectName}
      )
    ),
    fs.writeFile(`${projectRoot}/src/server/index.js`, 'export {default} from \'./server.js\';\n'),
    fs.copyFile(
      resolve(__dirname, '..', 'templates', 'webpack.config.server.mjs'),
      `${projectRoot}/webpack.config.server.babel.js`
    )
  ]);
}
