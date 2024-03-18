import path from 'node:path';
import { readFileSync } from 'fs';
import helmet from '@fastify/helmet';
import { fastifyStatic } from '@fastify/static';
import { createRequestHandler } from '@mcansh/remix-fastify';
import {
  type ServerBuild,
  installGlobals,
  type AppLoadContext,
} from '@remix-run/node';
import { fastify } from 'fastify';
import { envToLogger } from './logging.js';

const BUILD_DIR = path.join(process.cwd(), 'build');

installGlobals();

let vite =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((m) =>
        m.createServer({
          server: {
            https: {
              key: readFileSync('./.cert/server.key'),
              cert: readFileSync('./.cert/server.crt'),
            },
            middlewareMode: true,
          },
        }),
      );

let app = fastify({
  https: vite
    ? {
        key: readFileSync('./.cert/server.key'),
        cert: readFileSync('./.cert/server.crt'),
      }
    : null,
  logger: envToLogger[process.env.NODE_ENV] ?? true,
  keepAliveTimeout: 90000,
  requestTimeout: 95000,
});

// handle asset requests
if (vite) {
  let middie = await import('@fastify/middie').then((m) => m.default);
  await app.register(middie);
  await app.use(vite.middlewares);
} else {
  await app.register(fastifyStatic, {
    root: path.join(BUILD_DIR, 'client', 'assets'),
    prefix: '/assets',
    wildcard: true,
    decorateReply: false,
    cacheControl: true,
    dotfiles: 'allow',
    etag: true,
    maxAge: '1y',
    immutable: true,
    serveDotFiles: true,
    lastModified: true,
  });

  await app.register(fastifyStatic, {
    root: path.join(BUILD_DIR, 'client'),
    prefix: '/',
    wildcard: false,
    cacheControl: true,
    dotfiles: 'allow',
    etag: true,
    maxAge: '1h',
    serveDotFiles: true,
    lastModified: true,
  });
}

await app.register(helmet, {
  global: true,
  enableCSPNonces: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...(vite ? ['wss:'] : [])],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  },
});

app.register(async function (childServer) {
  childServer.removeAllContentTypeParsers();
  // allow all content types
  childServer.addContentTypeParser('*', (_request, payload, done) => {
    done(null, payload);
  });

  // handle SSR requests
  childServer.all('*', async (req, res) => {
    try {
      let handler = createRequestHandler({
        getLoadContext: (_, reply: typeof res): AppLoadContext => ({
          cspNonce: reply.cspNonce,
        }),
        build: (vite
          ? () => vite?.ssrLoadModule('virtual:remix/server-build')
          : () =>
              import(
                path.join(BUILD_DIR, 'server', 'index.js')
              )) as unknown as ServerBuild,
      });
      return handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });
});

let port = Number(process.env.PORT) || 3000;

await app.listen({ port, host: process.env.HOST });
if (vite) {
  app.log.info(`app listening at https://${process.env.HOST}:${port}`);
} else {
  app.log.info(`app listening on port ${port} over HTTPS`);
}
