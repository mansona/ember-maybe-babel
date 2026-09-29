import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'vite-app/tests/helpers';

module('Acceptance | typescript', function (hooks) {
  setupApplicationTest(hooks);

  test('plain .ts files go through babel', async function (assert) {
    await visit('/');

    assert.dom('[data-test-ts-target]').hasText('plain ts');
  });

  test('.gts files without a <template> go through babel', async function (assert) {
    await visit('/');

    assert.dom('[data-test-gts-target]').hasText('template-less gts');
  });
});
