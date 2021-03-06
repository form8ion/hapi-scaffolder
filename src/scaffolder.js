import scaffoldServer from './server';
import scaffoldDocumentation from './documentation';
import scaffoldTesting from './testing';

export async function scaffold({projectRoot, projectName, tests}) {
  const [testingResults] = await Promise.all([
    scaffoldTesting({projectRoot, tests}),
    scaffoldServer({projectRoot, projectName})
  ]);

  return {
    dependencies: [
      '@hapi/glue',
      '@hapi/good',
      'hapi-graceful-shutdown-plugin',
      'dotenv-safe',
      'good-bunyan',
      'bunyan'
    ],
    devDependencies: [
      'webpack',
      'webpack-cli',
      ...testingResults.devDependencies
    ],
    scripts: {
      build: 'npm-run-all --print-label --parallel build:*',
      'build:server': 'webpack --env production --config webpack.config.server.babel.js',
      start: 'node ./lib/server',
      'pretest:integration': 'run-s build'
    },
    documentation: scaffoldDocumentation()
  };
}
