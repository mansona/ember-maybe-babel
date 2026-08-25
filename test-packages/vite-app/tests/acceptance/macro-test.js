import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'vite-app/tests/helpers';

module('Acceptance | macros', function (hooks) {
  setupApplicationTest(hooks);

  test('make sure that embroider macros works correctly', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('[data-test-macro-target]').hasText('The face value is: [most amazing]')
  });
});
