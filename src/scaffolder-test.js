import {assert} from 'chai';
import scaffold from './scaffolder';

suite('scaffolder', () => {
  test('that the hapi details are scaffolded', async () => {
    assert.deepEqual(
      scaffold(),
      {
        dependencies: [
          '@hapi/glue',
          'hapi-graceful-shutdown-plugin'
        ]
      }
    );
  });
});
