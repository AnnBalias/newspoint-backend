export const schema = {
  tags: ['feed'],
  summary: 'Get feed data',
  description: 'Retrieve and parse RSS/Atom feed data',
  querystring: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        format: 'uri',
        description: 'Feed URL to parse (optional, uses default if not provided)',
      },
      force: {
        type: 'string',
        enum: ['1', 'true'],
        description: 'Force parsing without checking database (1 or true)',
      },
    },
  },
} as const;
