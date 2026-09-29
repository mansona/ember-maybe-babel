import process from 'node:process';
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

import {
  maybeBabelFilter,
  maybeBabelRegexFilter,
  regexFilter,
} from 'ember-maybe-babel';

function babelPlugin() {
  const options = { babelHelpers: 'runtime', extensions };

  switch (process.env.MAYBE_BABEL_FILTER ?? 'maybeBabelFilter') {
    case 'maybeBabelFilter':
      return babel({ ...options, filter: maybeBabelFilter });
    case 'maybeBabelRegexFilter': {
      const plugin = babel(options);
      plugin.transform.filter = maybeBabelRegexFilter;
      return plugin;
    }
    case 'regexFilter': {
      const plugin = babel(options);
      plugin.transform.filter = regexFilter();
      return plugin;
    }
    default:
      throw new Error(`Unknown MAYBE_BABEL_FILTER: ${process.env.MAYBE_BABEL_FILTER}`);
  }
}

export default defineConfig({
  plugins: [classicEmberSupport(), ember(), babelPlugin()],
});
