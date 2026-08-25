import { pageTitle } from 'ember-page-title';

import { getOwnConfig } from '@embroider/macros';

const face = getOwnConfig().face;

<template>
  {{pageTitle "ViteApp"}}
  <h2 id="title">Welcome to Ember</h2>

  <div data-test-macro-target>The face value is: [{{face}}]</div>

  {{outlet}}
</template>
