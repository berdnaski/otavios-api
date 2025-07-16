import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class NextAppointmentsUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(limit: number = 3) {
    return this.appointmentRepo.findNext(limit);
  }
}
