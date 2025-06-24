import { IUserRepository } from "../../@types/repositories/UserRepository";

export class FindOneUsersUseCase {
    constructor (private readonly userRepository: IUserRepository) {}

    async execute(ident: string) {
        const user = await this.userRepository.findOne(ident);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}