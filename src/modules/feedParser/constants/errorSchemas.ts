export const ERROR_SCHEMAS = {
  400: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'array' },
      statusCode: { type: 'number' },
      timestamp: { type: 'string' },
    },
    required: ['error', 'message', 'details', 'statusCode', 'timestamp'],
  },
  500: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'number' },
      timestamp: { type: 'string' },
    },
    required: ['error', 'message', 'statusCode', 'timestamp'],
  },
} as const;
