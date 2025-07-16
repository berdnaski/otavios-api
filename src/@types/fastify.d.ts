import '@fastify/jwt'
import '@fastify/cookie'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: {
      verify: (token: string) => any;
      sign: (payload: any) => string;
    };
    user?: any;
  }
}