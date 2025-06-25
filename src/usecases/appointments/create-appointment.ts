import { CreateAppointmentDTO } from "../../@types/dto/appointment/CreateAppointmentDTO";
import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";
import { IUserRepository } from "../../@types/repositories/UserRepository";

export class CreateAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(data: CreateAppointmentDTO) {
        const existingUser = await this.userRepository.findById(data.barberId);

        if (!existingUser) {
            throw new Error("User not found");
        }

        const conflitDate = await this.appointmentRepository.findByDate(data.date, data.barberId);

        if (conflitDate) {
            throw new Error("Appointment already exists for this date and barber");
        }

        const appointment = await this.appointmentRepository.create(data);

        return appointment;
    }
}