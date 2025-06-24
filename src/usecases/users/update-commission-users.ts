import { UpdateCommissionDTO } from "../../@types/dto/UpdateCommissionDTO";
import { IUserRepository } from "../../@types/repositories/UserRepository";

export class UpdateCommissionUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({ userId, commission }: UpdateCommissionDTO) {
        if (commission < 0 || commission > 1) {
            throw new Error("Commission must be between 0 and 1");
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.role !== 'BARBER') {
            throw new Error("Only BARBER users can have their commission updated");
        }

        const updatedUser = await this.userRepository.updateCommission(userId, commission);

        return updatedUser;
    }
}