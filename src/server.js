import {promises} from 'fs';
import {resolve} from 'path';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot}) {
  const serverDirectory = await mkdir(`${projectRoot}/src/server`);

  await Promise.all([
    promises.copyFile(resolve(__dirname, '..', 'templates', 'server.js'), `${serverDirectory}/server.js`),
    promises.copyFile(resolve(__dirname, '..', 'templates', 'manifest.js'), `${serverDirectory}/manifest.js`),
    promises.writeFile(`${serverDirectory}/index.js`, "export {default} from './server';\n"),
    promises.copyFile(
      resolve(__dirname, '..', 'templates', 'webpack.config.server.js'),
      `${projectRoot}/webpack.config.server.babel.js`
    )
  ]);
}
