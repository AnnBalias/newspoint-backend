export const getFeedsResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success'] },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: {
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
          itemsCount: { type: 'number' },
        },
        required: [
          'id',
          'title',
          'link',
          'createdAt',
          'updatedAt',
          'itemsCount',
        ],
      },
    },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['status', 'message', 'data', 'timestamp'],
} as const;
