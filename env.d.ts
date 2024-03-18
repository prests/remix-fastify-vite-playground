/// <reference types="vite/client" />
import '@remix-run/node';

declare module '@remix-run/node' {
  export interface AppLoadContext {
    cspNonce: { script: string; style: string };
  }
}
