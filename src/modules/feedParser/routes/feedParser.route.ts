import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  errorResponseSchema,
  feedResponseSchema,
} from '../schemas/feedResponse.schema';
import { schema } from '../schemas/getFeedData.schema';
import { getErrorMessage } from '../services/errorHandler.service';
import { FeedParserService } from '../services/feedParser.service';

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();
  const feedParserService = new FeedParserService();

  route.get(
    '/feed',
    {
      schema: {
        ...schema,
        response: {
          200: feedResponseSchema,
          400: errorResponseSchema[400],
          500: errorResponseSchema[500],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { url } = request.query as { url?: string };

        if (!url) {
          return reply.badRequest('URL parameter is required');
        }

        if (!url.startsWith('http')) {
          return reply.badRequest('Invalid URL format');
        }

        if (!feedParserService.isRssUrl(url)) {
          return reply.badRequest('URL does not appear to be an RSS/XML feed');
        }

        const feedData = await feedParserService.parseFeed(url);

        return reply.send({
          status: 'success',
          message: 'Feed data retrieved successfully',
          data: feedData,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? getErrorMessage(error)
            : 'Failed to retrieve feed data';
        return reply.internalServerError(errorMessage);
      }
    }
  );
}
