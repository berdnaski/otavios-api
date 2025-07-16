import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";

interface SummaryByBarber {
  barberId: string;
  barberName: string;
  total: number;
}

export class SummaryByBarberUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(start: Date, end: Date): Promise<SummaryByBarber[]> {
    return this.appointmentRepo.getSummaryByBarber(start, end);
  }
}