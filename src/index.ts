import buildApp from './app';

async function start() {
  try {
    const fastify = await buildApp({
      logger: true,
    });

    const port = fastify.config.PORT;
    const host = fastify.config.HOST;

    fastify.listen({ port, host }, (err, address) => {
      if (err) {
        fastify.log.error({ error: err }, 'Failed to start server');
        process.exit(1);
      }
      fastify.log.info(`Server listening at ${address}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

void start();
