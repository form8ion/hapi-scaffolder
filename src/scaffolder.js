import deepmerge from 'deepmerge';

import scaffoldServer from './server.js';
import scaffoldDocumentation from './documentation.js';
import scaffoldTesting from './testing.js';

export async function scaffold({projectRoot, projectName, tests}) {
  const [testingResults] = await Promise.all([
    scaffoldTesting({projectRoot, tests}),
    scaffoldServer({projectRoot, projectName})
  ]);

  return deepmerge.all([
    {
      dependencies: [
        '@hapi/glue',
        'hapi-graceful-shutdown-plugin',
        'hapi-pino',
        'dotenv-safe'
      ],
      devDependencies: ['webpack', 'webpack-cli'],
      scripts: {
        build: 'npm-run-all --print-label --parallel build:*',
        'build:server': 'webpack --env production --config webpack.config.server.babel.js',
        start: 'node ./lib/server',
        'pretest:integration': 'run-s build'
      },
      documentation: scaffoldDocumentation()
    },
    testingResults
  ]);
}
