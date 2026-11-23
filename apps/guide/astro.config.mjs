// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { topics } from './src/topics.mjs';

// Served by the portal at stay.cactuscove.casa/guide, behind guest sign-in.
export default defineConfig({
  base: '/guide',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'House guide',
      logo: { src: './src/logo.svg', alt: 'Cactus Cove' },
      favicon: '/favicon.svg',
      customCss: ['@cactus-cove/theme/fonts.css', './src/styles/theme.css'],
      pagination: true,
      head: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }],
      sidebar: topics.map((slug) => ({ slug }))
    })
  ]
});
