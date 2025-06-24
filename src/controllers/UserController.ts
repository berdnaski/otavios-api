import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { FindAllUsersUseCase } from "../usecases/users/find-all-users";
import { UpdateCommissionRequest } from "../@types/dto/UpdateCommissionRequest";
import { UpdateCommissionUseCase } from "../usecases/users/update-commission-users";
import { FindOneUsersUseCase } from "../usecases/users/find-one-users";

export class UserController {
  async findAll(reply: FastifyReply) {
    try {
      const userRepository = new PrismaUserRepository();
      const findAllUsersUseCase = new FindAllUsersUseCase(userRepository);

      const users = await findAllUsersUseCase.execute();

      const usersWithoutPassword = users.map(({ password, ...user }) => user);

      return reply.status(200).send(usersWithoutPassword);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao buscar usuários.",
      });
    }
  }

  async findOne(
    req: FastifyRequest<{ Params: { ident: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { ident } = req.params;

      const userRepository = new PrismaUserRepository();
      const findOneUsersUseCase = new FindOneUsersUseCase(userRepository);

      const user = await findOneUsersUseCase.execute(ident);

      const { password, ...userWithoutPassword } = user;

      return reply.status(200).send(userWithoutPassword);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Error fetching user.",
      });
    }
  }


  async updateCommission(req: FastifyRequest<UpdateCommissionRequest>, reply: FastifyReply) {
    try {
      const loggedUser = req.user as { id: string; role: string };

      if (loggedUser.role !== "ADMIN") {
        return reply.status(403).send({ message: "Forbidden: Only ADMIN can update commission." });
      }

      const userRepository = new PrismaUserRepository();
      const updateCommissionUseCase = new UpdateCommissionUseCase(userRepository);

      const updatedUser = await updateCommissionUseCase.execute({
        userId: req.params.userId,
        commission: req.body.commission,
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return reply.send(userWithoutPassword);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Error updating commission.",
      });
    }
  }
}
