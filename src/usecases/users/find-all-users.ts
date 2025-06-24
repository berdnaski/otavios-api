import { IUserRepository } from "../../@types/repositories/UserRepository";

export class FindAllUsersUseCase {
    constructor (private readonly userRepository: IUserRepository) {}

    async execute() {
        const users = await this.userRepository.findAll();

        if (users.length === 0) {
            throw new Error("No users found");
        }

        return users;
    }
}