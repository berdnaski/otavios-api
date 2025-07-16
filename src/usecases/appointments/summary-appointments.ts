import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

export class SummaryAppointmentsUseCase {
  constructor(private readonly repo: IAppointmentRepository) { }

  async execute(start: Date, end: Date) {
    const appointments = await this.repo.findByDateRange(start, end);

    let totalEarnings = 0;
    let totalAppointments = 0;
    let barberReceives = 0;
    let adminReceives = 0;

    for (const appointment of appointments) {
      totalEarnings += appointment.totalPrice;
      totalAppointments += 1;

      for (const service of appointment.services) {
        const price = service.price;
        const commission = service.commission === null ? 1 : service.commission;

        const toBarber = price * commission;
        const toAdmin = price * (1 - commission);

        barberReceives += toBarber;
        adminReceives += toAdmin;
      }
    }

    return {
      totalEarnings,
      totalAppointments,
      barberReceives,
      adminReceives,
    };
  }
}
