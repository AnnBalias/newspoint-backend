import type { FromSchema } from 'json-schema-to-ts';

export const EnvSchema = {
  type: 'object',
  properties: {
    PORT: { type: 'number' },
    HOST: { type: 'string' },

    MONGO_URI: { type: 'string' },
    MONGO_DATABASE: { type: 'string', default: 'newspoint' },
    MONGO_ROOT_USERNAME: { type: 'string', default: 'admin' },
    MONGO_ROOT_PASSWORD: { type: 'string', default: 'password' },
    MONGO_EXPRESS_USERNAME: { type: 'string', default: 'admin' },
    MONGO_EXPRESS_PASSWORD: { type: 'string', default: 'pass' },
  },
  required: ['PORT', 'HOST', 'MONGO_URI'],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
