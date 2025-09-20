import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { schema } from '../schemas/getFeedData.schema';

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get(
    '/feed',
    {
      schema: {
        ...schema,
        response: {
          200: fastify.responseSchemas.success,
          400: fastify.responseSchemas.validationError,
          500: fastify.responseSchemas.error,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { url } = request.query as { url?: string };

        if (url && !url.startsWith('http')) {
          return reply
            .status(400)
            .send(
              fastify.errorResponse(
                'Validation Error',
                'Invalid URL format',
                400
              )
            );
        }

        const feedData = {
          feeds: [],
          total: 0,
        };

        return reply.send(
          fastify.successResponse('Feed data retrieved successfully', feedData)
        );
      } catch (error) {
        fastify.log.error('Error processing feed request:', error);
        return reply
          .status(500)
          .send(
            fastify.errorResponse(
              'Feed Processing Error',
              'Failed to retrieve feed data',
              500
            )
          );
      }
    }
  );
}
