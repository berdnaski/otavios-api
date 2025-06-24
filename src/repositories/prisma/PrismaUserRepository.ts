import { User } from "@prisma/client";
import { IUserRepository } from "../../@types/repositories/UserRepository";
import { prisma } from "../../prisma/client";
import { CreateUserDTO, CreateUserPrismaDTO } from "../../@types/dto/CreateUserDTO";

export class PrismaUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserPrismaDTO): Promise<User> {
        return prisma.user.create({ data });
    }
}