/// <reference types="vitest" />

import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ['**/.*'],
        appDirectory: 'src/remix-app',
        serverModuleFormat: 'esm',
      }),
    tsconfigPaths(),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.exclude,
        '**/__tests__/**',
        '**/dist/**',
        '**/public/**',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
      reporter: ['lcov', 'json', 'html'],
    },
    reporters: ['default'],
  },
  server: undefined,
});
