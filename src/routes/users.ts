import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import type { CreateUserDTO } from "../@types/dto/CreateUserDTO";
import type { LoginRequest } from "../@types/dto/LoginRequest";
import { LoginUserDTO } from "../@types/dto/LoginUserDTO";

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController(app);

  app.post<{ Body: CreateUserDTO }>("/auth/register", async (req, reply) => {
    await userController.create(req, reply);
  });

  app.post<{ Body: LoginUserDTO }>("/auth/login", async (req, reply) => {
    await userController.login(req, reply);
  });
}
