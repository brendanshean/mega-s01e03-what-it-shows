import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: { alias: { '#lib': resolve('src/lib') } },
  plugins: [sveltekit({
    extensions: ['.svelte', '.svx'],
    preprocess: [
      vitePreprocess(),
      mdsvex({ extensions: ['.svx'], layout: { runbook: resolve('src/lib/layouts/runbook.svelte') } })
    ],
    adapter: adapter({ pages: 'rendered', assets: 'rendered' })
  })]
});
