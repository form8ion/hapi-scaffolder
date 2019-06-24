import scaffoldServer from './server';

export async function scaffold({projectRoot}) {
  await scaffoldServer({projectRoot});

  return {
    dependencies: [
      '@hapi/glue',
      'hapi-graceful-shutdown-plugin'
    ],
    devDependencies: [
      'webpack',
      'webpack-cli'
    ],
    scripts: {
      build: 'npm-run-all --print-label --parallel build:*',
      'build:server': 'webpack --env production',
      start: 'node ./lib/server'
    }
  };
}
