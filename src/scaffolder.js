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
    ]
  };
}
