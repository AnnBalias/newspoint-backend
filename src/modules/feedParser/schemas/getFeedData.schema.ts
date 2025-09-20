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
        description: 'Feed URL to parse',
      },
    },
  },
} as const;
