import * as z from "zod";

/**
 * Use zod to provide typesafety around process.env
 * https://dev.to/remix-run-br/type-safe-environment-variables-on-both-client-and-server-with-remix-54l5
 */
const envSchema = z.object({
  ABORT_DELAY: z.preprocess((val) => parseInt(String(val), 10), z.number()),
});

type Env = z.infer<typeof envSchema>;

/**
 * Uses zod to get a typesafe process.env
 * @returns a parsed, typesafe process.env
 */
const getEnv = () => envSchema.parse(process.env);

export { getEnv };
export type { Env };
