import { FastifyReply, FastifyRequest } from "fastify";

export async function isAdmin(req: FastifyRequest, reply: FastifyReply) {
  const user = req.user as { role?: string };

  if (user?.role !== "ADMIN") {
    return reply.status(403).send({ message: "Forbidden: Admins only." });
  }
}