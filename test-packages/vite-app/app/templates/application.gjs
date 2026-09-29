import { pageTitle } from 'ember-page-title';

import { getOwnConfig } from '@embroider/macros';
import { fromTs } from '../utils/typed.ts';
import { fromGts } from '../utils/template-less.gts';

const face = getOwnConfig().face;

<template>
  {{pageTitle "ViteApp"}}
  <h2 id="title">Welcome to Ember</h2>

  <div data-test-macro-target>The face value is: [{{face}}]</div>
  <div data-test-ts-target>{{fromTs}}</div>
  <div data-test-gts-target>{{fromGts}}</div>

  {{outlet}}
</template>
