import { installGlobals } from '@remix-run/node';
import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import * as axeMatchers from 'vitest-axe/matchers';

import type { Env } from 'src/remix-app/utils/server-only/env.server';

expect.extend(matchers);
expect.extend(axeMatchers);

// Resolves a JS DOM concurrency bug https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
HTMLCanvasElement.prototype.getContext = () => null;

// Mock env variables
const mockEnv: Env = {
  ABORT_DELAY: 5_000,
};

Object.entries(mockEnv).forEach(([key, value]) =>
  vi.stubEnv(key, value.toString()),
);

afterEach(() => {
  cleanup();
});

installGlobals();
