import {assert} from 'chai';
import scaffoldDocumentation from './documentation';

suite('documentation', () => {
  test('that details are provided', () => {
    assert.deepEqual(
      scaffoldDocumentation(),
      {
        usage: `### Build the Bundle

\`\`\`sh
$ npm run build
\`\`\`

### Start the Server

\`\`\`sh
$ npm start
\`\`\``
      }
    );
  });
});
