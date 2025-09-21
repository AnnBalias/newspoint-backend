import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { getFeedDataRoutes } from '../modules/feedParser/routes/feedParser.route';

const pluginName = 'feed-parser-routes';

export default fp(
  async (fastify: FastifyInstance) => {
    try {
      await fastify.register(getFeedDataRoutes);
      fastify.log.info(`${pluginName} registered successfully`);
    } catch (error) {
      fastify.log.error(`Failed to register ${pluginName}:`, error);
      throw error;
    }

    fastify.pluginLoaded(pluginName);
  },
  {
    name: pluginName,
    dependencies: ['prisma-plugin', 'sensible-plugin'],
  }
);
