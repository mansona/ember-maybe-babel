import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import EmberApp from 'ember-cli/lib/broccoli/ember-app.js';
import { compatBuild } from '@embroider/compat';

export default async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  const app = new EmberApp(defaults, {
    '@embroider/macros': {
      setOwnConfig: {
        face: 'most amazing',
      },
    },
  });

  return compatBuild(app, buildOnce);
}
