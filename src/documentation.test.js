import {it, expect, describe} from 'vitest';

import scaffoldDocumentation from './documentation.js';

describe('documentation scaffolder', () => {
  it('should provide usage details', async () => {
    expect(scaffoldDocumentation()).toEqual({
      usage: `### Build the Bundle

\`\`\`sh
$ npm run build
\`\`\`

### Start the Server

\`\`\`sh
$ npm start
\`\`\``
    });
  });
});
