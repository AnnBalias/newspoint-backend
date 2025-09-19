import buildApp from "./app";

async function start() {
  const fastify = await buildApp({
    logger: true,
  })

  const port = fastify.config.PORT
  const host = fastify.config.HOST
  
  fastify.listen({ port, host }, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
} 

void start();