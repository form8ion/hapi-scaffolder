import scaffoldServer from './server';
import scaffoldDocumentation from './documentation';

export async function scaffold({projectRoot, projectName}) {
  await scaffoldServer({projectRoot, projectName});

  return {
    dependencies: [
      '@hapi/glue',
      '@hapi/good',
      '@hapi/good-bunyan',
      'hapi-graceful-shutdown-plugin',
      'bunyan'
    ],
    devDependencies: [
      'webpack',
      'webpack-cli'
    ],
    scripts: {
      build: 'npm-run-all --print-label --parallel build:*',
      'build:server': 'webpack --env production --config webpack.config.server.babel.js',
      start: 'node ./lib/server'
    },
    documentation: scaffoldDocumentation()
  };
}
