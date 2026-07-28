/**
 * Most of this code was taken from https://github.com/discourse/discourse/blob/7f591bc7c590eb4f9f970a5deb33a25bfee3575a/frontend/discourse/lib/maybe-babel.mjs
 * and previous iterations of the same code. This is currently provided as an experiment for people to try out and report back their findings
 */

import { parse as oxcParse } from 'oxc-parser';
import { walk } from 'zimmerframe';
import { extensions } from '@embroider/vite';
import { and, code, id, include, not, or } from '@rolldown/pluginutils';

const babelRequiredImports = [
  // Templates
  '@ember/template-compiler',
  '@ember/template-compilation',
  'ember-cli-htmlbars',
  'ember-cli-htmlbars-inline-precompile',
  'htmlbars-inline-precompile',

  // Macros
  '@embroider/macros',
  '@glimmer/env',
  '@ember/debug',
  '@ember/application/deprecations',
];

/**
 * 
 * @param {string} id 
 * @param {string} code 
 * @returns 
 */
export async function maybeBabelFilter(id, code) {
  const estree = await oxcParse(id, code);

  let hasDecorators = false;
  let hasBabelRequiredImport = false;

  walk(
    estree.program,
    /* state */ {},
    {
      // @ts-expect-error
      Decorator(_node, { stop }) {
        hasDecorators = true;
        stop();
      },
      ImportDeclaration(node, { stop }) {
        if (babelRequiredImports.includes(node.source.value)) {
          hasBabelRequiredImport = true;
          stop();
        }
      },
    }
  );

  return hasDecorators || hasBabelRequiredImport;
}

/**
 * @param {string} s 
 * @returns 
 */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const importsRegex = new RegExp(babelRequiredImports.map(escapeRegExp).join('|'));

const decoratorRegex = /(?<![\w'"`])(?<!\*\s+)(?<!\/\/[^\n]*)(?<!\/\*[^\n]*)@\w+/;
//                     └────┬─────┘└───┬───┘└──────┬──────┘└──────┬──────┘└┬─┘
//                          │          │           │              │        │
//                          │          │           │              │        └── the `@decorator`
//                          │          │           │              └──────── not inside a single-line block comment (`/* @dec */`)
//                          │          │           └─────────────────────── not on a `//` line comment
//                          │          └─────────────────────────────────── not a JSDoc tag, even with multiple spaces (`*    @param`)
//                          └────────────────────────────────────────────── not mid-identifier or inside a string

const nodeModulesPattern = /\/node_modules\//;

const regExpCharactersRegExp = /[\\^$.*+?()[\]{}|]/g;
/**
 * 
 * @param {string} str 
 * @returns 
 */
const escapeRegExpCharacters = (str) => str.replace(regExpCharactersRegExp, '\\$&');

const extensionRegExp = new RegExp(
  `(${extensions
    .filter(ext => ext !== '.json')
    .map(escapeRegExpCharacters)
    .join('|')})(\\?.*)?(#.*)?$`
);

export const maybeBabelRegexFilter = [
  include(
    and(
      id(extensionRegExp), // Is one of the babel-supported extensions
      or(
        code(importsRegex), // Imports one of our listed modules
        and(not(id(nodeModulesPattern)), code(decoratorRegex)) // Is local app code which uses a decorator
      )
    )
  ),
];

/**
 * @typedef {Object} Options
 * @property {string[]} [include] - If any additional (custom) plugins are provided, a pattern 
 * should be provided that detects their usage
 * @property {(string | RegExp)[]} [code] - If any additional (custom) plugins are provided, a pattern 
 * should be provided that detects their usage
 */


/**
 * This regexFilter function was proposed by NullVoxPopuli in this PR https://github.com/embroider-build/embroider/pull/2784
 * @param {Options} options 
 * @returns 
 */

export function regexFilter(options) {
  const importsRegex = new RegExp(
    babelRequiredImports
      .concat(options?.include?.imports ?? [])
      .map(escapeRegExp)
      .join('|')
  );

  return [
    include(
      and(
        // is one of the babel-supported extensions
        id(extensionRegExp),
        or(
          // always run gts and gjs through babel
          id(/\.gts$/),
          id(/\.gjs$/),
          // imports one of the modules above
          code(importsRegex),
          // (a common way to do translations)
          // local app code using a decorator
          // NOTE: maybeBabel requires that all libraries compile away their decorators
          //
          // TODO: what do we do when native decorators start shipping?
          //     (ignore decorator transforming entirely?)
          and(not(id(nodeModulesPattern)), code(decoratorRegex)),
          // user provided additional opt-ins to the regex here
          ...(options?.include?.code?.map(x => code(x)) ?? [])
        )
      )
    ),
  ];
}