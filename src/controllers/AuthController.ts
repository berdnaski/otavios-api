import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { CreateUserUseCase } from "../usecases/auth/create-user";
import { LoginUserUseCase } from "../usecases/auth/login-user";

import { CreateUserDTO } from "../@types/dto/CreateUserDTO";
import { LoginRequest } from "../@types/dto/LoginRequest";

export class AuthController {
  constructor(private app: FastifyInstance) {}

  async create(
    req: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply
  ) {
    try {
      const userRepository = new PrismaUserRepository();
      const createUserUseCase = new CreateUserUseCase(userRepository);

      const user = await createUserUseCase.execute(req.body);

      const { password, ...userWithoutPassword } = user;

      return reply.status(201).send(userWithoutPassword);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao criar o usuário.",
      });
    }
  }

async login(
  req: FastifyRequest<LoginRequest>,
  reply: FastifyReply
) {
  try {
    const userRepository = new PrismaUserRepository();
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    const user = await loginUserUseCase.execute(req.body);

    const token = this.app.jwt.sign({
      sub: user.id,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    reply
      .send({
        user: userWithoutPassword,
        token: token
      });

  } catch (error: any) {
    return reply.status(401).send({
      message: error.message || "Erro ao fazer login",
    });
  }
}

}
