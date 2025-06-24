import { CreateUserDTO } from "../../@types/dto/CreateUserDTO";
import { IUserRepository } from "../../@types/repositories/UserRepository";
import { hashPassword } from "../../utils/hash";

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        const hashedPassword = await hashPassword(data.password);

        const userData = {
            ...data,
            password: hashedPassword,
            role: data.role ?? 'BARBER',
            commission: data.commission ?? 1.0,
        };

        const user = await this.userRepository.create(userData);

        return user;
    }
}