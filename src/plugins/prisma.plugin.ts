import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '../generated/prisma';

const pluginName = 'prisma-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(
  async (fastify: FastifyInstance) => {
    try {
      const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });

      await prisma.$connect();
      fastify.log.info('✅ Connected to database successfully');

      fastify.decorate('prisma', prisma);

      fastify.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
        fastify.log.info('✅ Disconnected from database');
      });

      fastify.log.info(`${pluginName} registered successfully`);
    } catch (error) {
      fastify.log.error(`Failed to register ${pluginName}:`, error);
      throw error;
    }

    fastify.pluginLoaded(pluginName);
  },
  {
    name: pluginName,
    dependencies: [],
  }
);
