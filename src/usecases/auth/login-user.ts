import { LoginUserDTO } from "../../@types/dto/LoginUserDTO";
import { IUserRepository } from "../../@types/repositories/UserRepository";
import { comparePassword } from "../../utils/hash";

export class LoginUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({ email, password }: LoginUserDTO) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found with this email");
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return user;
    }
}