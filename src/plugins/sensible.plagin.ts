import sensible from '@fastify/sensible';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

const pluginName = 'sensible-plugin';

export default fp(
  async (fastify: FastifyInstance) => {
    try {
      await fastify.register(sensible);
      fastify.log.info(`${pluginName} registered successfully`);
    } catch (error) {
      fastify.log.error(`Failed to register ${pluginName}:`, error);
      throw error;
    }

    fastify.pluginLoaded(pluginName);
  },
  {
    name: pluginName,
  }
);
