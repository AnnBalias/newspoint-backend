import { Config } from '../config/schema';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    pluginLoaded: (pluginName: string) => void;
    responseSchemas: {
      success: Record<string, unknown>;
      error: Record<string, unknown>;
      validationError: Record<string, unknown>;
    };
    successResponse: (
      message: string,
      data: unknown
    ) => Record<string, unknown>;
    errorResponse: (
      error: string,
      message: string,
      statusCode: number
    ) => Record<string, unknown>;
  }
}
