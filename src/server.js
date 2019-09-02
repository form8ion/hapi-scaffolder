import {promises} from 'fs';
import {resolve} from 'path';
import mustache from 'mustache';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, projectName}) {
  const serverDirectory = await mkdir(`${projectRoot}/src/server`);

  await Promise.all([
    promises.copyFile(resolve(__dirname, '..', 'templates', 'server.js'), `${serverDirectory}/server.js`),
    promises.writeFile(
      `${serverDirectory}/manifest.js`,
      mustache.render(
        await promises.readFile(resolve(__dirname, '..', 'templates', 'manifest.mustache'), 'utf8'),
        {projectName}
      )
    ),
    promises.writeFile(`${serverDirectory}/index.js`, 'export {default} from \'./server\';\n'),
    promises.copyFile(
      resolve(__dirname, '..', 'templates', 'webpack.config.server.js'),
      `${projectRoot}/webpack.config.server.babel.js`
    )
  ]);
}
