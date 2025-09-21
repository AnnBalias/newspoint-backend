export const getFeedByIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
} as const;

export const getFeedByIdResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success'] },
    message: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        lastBuildDate: { type: 'string' },
        language: { type: 'string' },
        generator: { type: 'string' },
        category: { type: 'string' },
        imageUrl: { type: 'string', nullable: true },
        imageTitle: { type: 'string', nullable: true },
        imageLink: { type: 'string', nullable: true },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              link: { type: 'string' },
              pubDate: { type: 'string' },
              guid: { type: 'string' },
              author: { type: 'string' },
              content: { type: 'string' },
              imageUrl: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              categories: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: [
              'id',
              'title',
              'link',
              'createdAt',
              'updatedAt',
              'categories',
            ],
          },
        },
      },
      required: ['id', 'title', 'link', 'createdAt', 'updatedAt', 'items'],
    },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['status', 'message', 'data', 'timestamp'],
} as const;

export const notFoundResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
  },
  required: ['error', 'message', 'statusCode'],
} as const;
