import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp(
  async (fastify: FastifyInstance) => {
    const responseSchemas = {
      success: {
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
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['status', 'message', 'data', 'timestamp'],
      },
      error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          statusCode: {
            type: 'number',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['error', 'message', 'statusCode', 'timestamp'],
      },
      validationError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            enum: ['Validation Error'],
          },
          message: {
            type: 'string',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          statusCode: {
            type: 'number',
            enum: [400],
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['error', 'message', 'details', 'statusCode', 'timestamp'],
      },
    };

    fastify.decorate('responseSchemas', responseSchemas);

    fastify.decorate('successResponse', (message: string, data: unknown) => ({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    }));

    fastify.decorate(
      'errorResponse',
      (error: string, message: string, statusCode: number) => ({
        error,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
      })
    );

    fastify.pluginLoaded('response-schema-plugin');
  },
  {
    name: 'response-schema-plugin',
  }
);
