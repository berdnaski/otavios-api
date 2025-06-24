import { User } from "@prisma/client";
import { CreateUserDTO } from "../dto/CreateUserDTO";

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
}