import { UpdateAppointmentDTO } from "../../@types/dto/appointment/UpdateAppointmentDTO";
import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class UpdateAppointmentIdUseCase {
    constructor (private readonly appointmentRepository: IAppointmentRepository) {}

    async execute(appointmentId: string, data: UpdateAppointmentDTO) {
        const existingAppointment = await this.appointmentRepository.findById(appointmentId);

        if (!existingAppointment) {
            throw new Error("Appointment not found");
        }

        const updatedAppointment = await this.appointmentRepository.update(appointmentId, data);

        return updatedAppointment;
    }
}