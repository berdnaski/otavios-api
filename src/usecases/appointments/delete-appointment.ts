import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class DeleteAppointmentUseCase {
    constructor(private readonly appointmentRepository: IAppointmentRepository) {}

    async execute(appointmentId: string) {
        const existingAppointment = await this.appointmentRepository.findById(appointmentId);

        if (!existingAppointment) {
            throw new Error("Appointment not found");
        }

        await this.appointmentRepository.delete(appointmentId);
    }
}