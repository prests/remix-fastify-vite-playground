FROM node:18-bullseye-slim as base
RUN npm install -g pnpm

ENV NODE_ENV production
ARG APPLICATION_PORT=3000
ENV PORT ${APPLICATION_PORT}

FROM base as deps
WORKDIR /app

ADD package.json .npmrc pnpm-lock.yaml ./
RUN pnpm install --production=false --frozen-lockfile --prefer-offline --config.ignore-scripts=true

FROM base as production-deps
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json .npmrc ./
RUN pnpm prune --prod --config.ignore-scripts=true

FROM base as build
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN pnpm run build

FROM base
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json

EXPOSE $APPLICATION_PORT

CMD ["pnpm", "start"]
