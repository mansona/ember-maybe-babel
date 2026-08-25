import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// TODO: convert this into some sort of scenario test that will verify all the different
// filters that are exported
import { maybeBabelFilter } from 'ember-maybe-babel';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
      filter: maybeBabelFilter,
    }),
  ],
});
