# embroider-maybe-babel

This is an experimental package that provides various filters that can be passed to `@rollup/plugin-babel` to improve the build speeds of Ember applications.

This package provides 3 different functions so that you can test each of them in turn in your own applications and give us feedback of what does or doesn't work.

Please open an issue detailing which function was the best for you and if any of them caused any correctness issues. 

## Usage

To use this package you can import any of the available filters and pass them to the `filter` option of `@rollup/plugin-babel`: 

```js
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// import one of these for testing
import { maybeBabelFilter, maybeBabelRegexFilter, regexFitler }


export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      // and pass the function you are using here
      filter: maybeBabelFilter,
    }),
  ],
});
```

Each of the different functions have different charactistics so that's why we are providing multiple versions so people can test. I will try to describe the differences in the following sections

### maybeBabelFilter

`maybeBabelFilter` internally uses `oxc-parser` to parse the file and `zimmerframe` to walk the file to find if it's using decorators or if it's importing from a list of imports that are known that we would need to run babel.

### maybeBabelRegexFilter

`maybeBabelRegexFilter` tries to do the same as the above function, but completely relying on Regular Expressions, the theory being that this can make use of more of the `rollup` rust infrastructure because it doesn't need to pass the code back and forth between JS and rust (which can be expensive)

### regexFitler

`regexFitler` is an extension of `maybeBabelRegexFilter` but with the ability to extend what is being covered by the regexes

for example, to also run babel on files that import from ember-concurrency

```js
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// import one of these for testing
import { regexFitler }


export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      // and pass the function you are using here
      filter: regexFitler({
        code: ['ember-concurrency'],
      }),
    }),
  ],
});
```

or to also run babel on files that use polyfilled APIs, or use the "formatMessage" technique for translations: 

```js
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// import one of these for testing
import { regexFitler }


export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      // and pass the function you are using here
      filter: regexFitler({
        code: ['myPolyfilledAPICall(', /\bintl\.formatMessage\b/],
      }),
    }),
  ],
});
```