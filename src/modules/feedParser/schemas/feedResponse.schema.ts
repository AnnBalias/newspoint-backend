export const feedResponseSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['success'],
    },
    message: {
      type: 'string',
    },
    data: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        lastBuildDate: { type: 'string' },
        language: { type: 'string' },
        generator: { type: 'string' },
        category: { type: 'string' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            url: { type: 'string' },
            title: { type: 'string' },
            link: { type: 'string' },
          },
          required: ['url', 'title', 'link'],
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              link: { type: 'string' },
              pubDate: { type: 'string' },
              guid: { type: 'string' },
              categories: {
                type: 'array',
                items: { type: 'string' },
              },
              author: { type: 'string' },
              image: { type: 'string', nullable: true },
              content: { type: 'string' },
            },
            required: [
              'title',
              'description',
              'link',
              'pubDate',
              'guid',
              'categories',
              'author',
              'content',
            ],
          },
        },
      },
      required: [
        'title',
        'description',
        'link',
        'lastBuildDate',
        'language',
        'generator',
        'category',
        'items',
      ],
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['status', 'message', 'data', 'timestamp'],
};

export const errorResponseSchema = {
  400: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'array' },
      statusCode: { type: 'number' },
      timestamp: { type: 'string' },
    },
    required: ['error', 'message', 'statusCode'],
  },
  500: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'number' },
      timestamp: { type: 'string' },
    },
    required: ['error', 'message', 'statusCode'],
  },
} as const;
