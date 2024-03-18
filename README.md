# Overview

A Remix web app powered by Vite and Fastify!

## App Structure

- `src` - Contains all core application source code, and constists of these top level directories:
  - `remix-app` - Contains any code used by the Remix application, including code shared with the fastify server
    - **NOTE** - Inside of `remix-app` files that run server only code (aka `.server.ts` files) should be wrapped inside a directory named `server-only`
  - `fastify-server` - Contains any code that is exclusively for the Fastify server that Remix runs on
    - For further context on why weneed a separate server to run Remix on please see [this Remix document](https://remix.run/docs/en/v1/pacages/technical-explanation#http-handler-and-adapters)

## Development

#### **Important** - Make sure you run `pnpm install` before using any other pnpm scripts

### 1. Configure Local Hostname

When running locally, this app will server traffic over https using an aliased domain rather than the default localhost.
This is done to allow access to cookies from the test domain for things like auth, etc.

- `/etc/hosts` mapping created for your custom domain - Needs to be done by each individual developer
  - In your specific `hosts` file, create new entries mapping `127.0.0.1` to your custom domain
    - Mac - `/etc/hosts`
    - Windows - `C:\Windows\System32\Drivers\etc\hosts`

```
127.0.0.1 <your-hostname-here>
```

### 2. Configure HTTPS Certificates

To run the site locally over https, you will want to make sure you have the proper self-signed certificate configured in the repository. To get the cert just do the following:

1. Ensure that `scripts/generate-dev-cert.sh` has the proper domain name listed in it as `DNS_1` and the proper `ORG_NAME` - Should bedone on repo scaffolding and then committed to git
2. Run `pnpm run generate-cert` locally to get your certificate
   - **IMPORTANT** - This must be ran from the root of the repository
   - If on Windows, you may need to run `sed -i -e 's/\r$//' scripts/generate-dev-cert.sh` to fix line endings

### 3. Configure Local Environment Variables

When running locally, the project's environment variables are loaded in from a `.env` file at the root of the project via the `dotenvx` module

To ensure sensitive values stay out of source control, we gitignore the `.env` file

```sh
ABORT_DELAY=5000
```

### 4. Run Locally

Start the Remix development server by running:

```sh
pnpm run dev
```

This starts your app in development mode, which will provide Hot Module Reloading (HMR) so changes can be seen in the browser without reloading the whole page upon saving. In localdev, the client is ran in react StrictMode which allows for better error checking but may result in multiple mounts of the same component locally. See the docs [here](https://react.dev/reference/react/StrictMode) for details.
