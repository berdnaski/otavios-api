import { zonedTimeToUtc } from "date-fns-tz";
import { CreateAppointmentDTO } from "../../@types/dto/appointment/CreateAppointmentDTO";
import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";
import { IUserRepository } from "../../@types/repositories/UserRepository";

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly userRepo: IUserRepository,
  ) { }

  async execute(data: CreateAppointmentDTO) {
    const user = await this.userRepo.findById(data.barberId);
    if (!user) throw new Error("User not found");

    const appointmentDate = zonedTimeToUtc(data.date, "America/Sao_Paulo");


    const conflict = await this.appointmentRepo.findByDate(appointmentDate, data.barberId);
    if (conflict) throw new Error("Appointment already exists for this date and barber");

    const totalPrice = data.services.reduce((sum, service) => sum + service.price, 0);

    return this.appointmentRepo.create({
      ...data,
      date: appointmentDate.toISOString(),
      totalPrice,
    });
  }
}
