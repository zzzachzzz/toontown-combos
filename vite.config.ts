/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/toontown-combos/' : '/',
  plugins: [
    // solid-devtools: https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    devtools({
      autoname: true,
    }),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
    setupFiles: [
      'node_modules/@testing-library/jest-dom/extend-expect.js',
      './src/test-setup.ts',
    ],
    // otherwise, solid would be loaded twice:
    deps: { registerNodeLoader: true },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: false,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
