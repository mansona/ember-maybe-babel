import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpreter } from '@rolldown/pluginutils';
import { regexFilter } from '../index.js';

const id = '/app/components/foo.js';

test('regexFilter runs babel on code that matches the `code` option', () => {
  const filter = regexFilter({ code: [/\bintl\.formatMessage\b/] });

  assert.equal(interpreter(filter, 'intl.formatMessage("hi");', id), true);
  assert.equal(interpreter(filter, 'console.log("hi");', id), false);
});

test('regexFilter runs babel on imports listed in the `include` option', () => {
  const filter = regexFilter({ include: ['ember-concurrency'] });

  assert.equal(
    interpreter(filter, "import { task } from 'ember-concurrency';", id),
    true,
  );
});
