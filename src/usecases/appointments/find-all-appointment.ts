import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class FindAllAppointmentUseCase {
    constructor(private appointmentRepository: IAppointmentRepository) {}

    async execute() {
        const appointments = await this.appointmentRepository.findAll();

        if (!appointments || appointments.length === 0) {
            throw new Error("No appointments found");
        }

        return appointments;
    }
}