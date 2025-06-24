import type { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import type { CreateUserDTO } from "../@types/dto/CreateUserDTO";
import { LoginUserDTO } from "../@types/dto/LoginUserDTO";

export async function authRoutes(app: FastifyInstance) {
  const userController = new AuthController(app);

  app.post<{ Body: CreateUserDTO }>("/auth/register", async (req, reply) => {
    await userController.create(req, reply);
  });

  app.post<{ Body: LoginUserDTO }>("/auth/login", async (req, reply) => {
    await userController.login(req, reply);
  });
}
