import { FastifyInstance } from "fastify";

export async function generateToken(app: FastifyInstance, payload: object) {
    return app.jwt.sign(payload);
}