import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class FindAllBarberIdAppointmentUseCase {
    constructor(private appointmentRepository: IAppointmentRepository) {}

    async execute(barberId: string) {
        const appointments = await this.appointmentRepository.findAllByBarberId(barberId);

        if (!appointments || appointments.length === 0) {
            throw new Error("No appointments found to barber");
        }

        return appointments;
    }
}