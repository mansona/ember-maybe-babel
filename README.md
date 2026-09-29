# embroider-maybe-babel

This is an experimental package that provides various filters that can be passed to `@rollup/plugin-babel` to improve the build speeds of Ember applications.

This package provides 3 different functions so that you can test each of them in turn in your own applications and give us feedback of what does or doesn't work.

Please open an issue detailing which function was the best for you and if any of them caused any correctness issues. 

## Usage

`maybeBabelFilter` is a function. Pass it to the `filter` option of `@rollup/plugin-babel`:

```js
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { maybeBabelFilter } from 'ember-maybe-babel';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      filter: maybeBabelFilter,
    }),
  ],
});
```

`maybeBabelRegexFilter` and `regexFilter()` are rolldown hook filters, not functions. `@rollup/plugin-babel` ignores a `filter` option that is not a function, so babel would then run on every file. Set them as the filter of the plugin's `transform` hook instead:

```js
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { maybeBabelRegexFilter } from 'ember-maybe-babel';

const babelPlugin = babel({ babelHelpers: 'runtime', extensions });
babelPlugin.transform.filter = maybeBabelRegexFilter;

export default defineConfig({
  plugins: [classicEmberSupport(), ember(), babelPlugin],
});
```

Each of the different functions have different charactistics so that's why we are providing multiple versions so people can test. I will try to describe the differences in the following sections

### maybeBabelFilter

`maybeBabelFilter` internally uses `oxc-parser` to parse the file and `zimmerframe` to walk the file to find if it's using decorators or if it's importing from a list of imports that are known that we would need to run babel.

### maybeBabelRegexFilter

`maybeBabelRegexFilter` tries to do the same as the above function, but completely relying on Regular Expressions, the theory being that this can make use of more of the `rollup` rust infrastructure because it doesn't need to pass the code back and forth between JS and rust (which can be expensive)

### regexFilter

`regexFilter` is an extension of `maybeBabelRegexFilter` but with the ability to extend what is being covered by the regexes

For example, to also run babel on files that import from ember-concurrency:

```js
const babelPlugin = babel({ babelHelpers: 'runtime', extensions });
babelPlugin.transform.filter = regexFilter({
  include: ['ember-concurrency'],
});
```

Or to also run babel on files that use polyfilled APIs, or use the "formatMessage" technique for translations:

```js
const babelPlugin = babel({ babelHelpers: 'runtime', extensions });
babelPlugin.transform.filter = regexFilter({
  code: ['myPolyfilledAPICall(', /\bintl\.formatMessage\b/],
});
```
