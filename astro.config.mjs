// https://astro.build/config
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // Your final, deployed URL
  site: 'https://www.my-site.dev',
  // The base path to deploy to
  base: '/',
  integrations: [sitemap(), purgecss(), compress()],
  output: "server",
  adapter: cloudflare()
});