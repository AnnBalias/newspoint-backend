import type { FromSchema } from 'json-schema-to-ts';

export const EnvSchema = {
  type: 'object',
  properties: {
    PORT: { type: 'number', default: 3000 },
    HOST: { type: 'string', default: '127.0.0.1' },
    DATABASE_URL: { type: 'string' },
    DEFAULT_FEED_URL: {
      type: 'string',
      default: 'https://hnrss.org/frontpage',
    },
    MONGO_DATABASE: { type: 'string', default: 'newspoint' },
    MONGO_ROOT_USERNAME: { type: 'string', default: 'admin' },
    MONGO_ROOT_PASSWORD: { type: 'string', default: 'password' },
    MONGO_EXPRESS_USERNAME: { type: 'string', default: 'admin' },
    MONGO_EXPRESS_PASSWORD: { type: 'string', default: 'pass' },
  },
  required: ['PORT', 'HOST', 'DATABASE_URL'],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
