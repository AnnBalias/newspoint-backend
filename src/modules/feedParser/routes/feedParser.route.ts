import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  errorResponseSchema,
  feedResponseSchema,
} from '../schemas/feedResponse.schema';
import {
  getFeedByIdParamsSchema,
  getFeedByIdResponseSchema,
  notFoundResponseSchema,
} from '../schemas/getFeedById.schema';
import { schema } from '../schemas/getFeedData.schema';
import { getFeedsResponseSchema } from '../schemas/getFeeds.schema';
import { DatabaseService } from '../services/database.service';
import { getErrorMessage } from '../services/errorHandler.service';
import { FeedParserService } from '../services/feedParser.service';
import {
  transformFeedForList,
  transformFeedWithItems,
} from '../utils/feedTransformers';

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();
  const databaseService = new DatabaseService(fastify.prisma);
  const feedParserService = new FeedParserService(databaseService);

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
        const { url, force } = request.query as {
          url?: string;
          force?: string;
        };
        const feedUrl = url || fastify.config.DEFAULT_FEED_URL;
        const isForce = force === '1' || force === 'true';

        if (!feedUrl.startsWith('http')) {
          return reply.badRequest('Invalid URL format');
        }

        if (!feedParserService.isRssUrl(feedUrl)) {
          return reply.badRequest('URL does not appear to be an RSS/XML feed');
        }

        const feedData = await feedParserService.getFeedData(feedUrl, isForce);

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

  route.get(
    '/feeds',
    {
      schema: {
        response: {
          200: getFeedsResponseSchema,
          500: errorResponseSchema[500],
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const feeds = await databaseService.getAllFeeds();
        const feedsWithCount = feeds.map(transformFeedForList);

        return reply.send({
          status: 'success',
          message: 'Feeds retrieved successfully',
          data: feedsWithCount,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? getErrorMessage(error)
            : 'Failed to retrieve feeds';
        return reply.internalServerError(errorMessage);
      }
    }
  );

  route.get(
    '/feeds/:id',
    {
      schema: {
        params: getFeedByIdParamsSchema,
        response: {
          200: getFeedByIdResponseSchema,
          404: notFoundResponseSchema,
          500: errorResponseSchema[500],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };

        const feed = await databaseService.getFeedById(id);

        if (!feed) {
          return reply.notFound('Feed not found');
        }

        const feedWithItems = transformFeedWithItems(feed);

        return reply.send({
          status: 'success',
          message: 'Feed retrieved successfully',
          data: feedWithItems,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? getErrorMessage(error)
            : 'Failed to retrieve feed';
        return reply.internalServerError(errorMessage);
      }
    }
  );
}
