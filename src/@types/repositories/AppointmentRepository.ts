import { Appointment } from "@prisma/client";
import { CreateAppointmentDTO } from "../dto/appointment/CreateAppointmentDTO";
import { UpdateAppointmentDTO } from "../dto/appointment/UpdateAppointmentDTO";

export interface IAppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    create(data: CreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date, barberId: string): Promise<Appointment | null>;
    findAll(): Promise<Appointment[]>;
    findAllByBarberId(barberId: string): Promise<Appointment[]>;
    update(appointmentId: string, data: UpdateAppointmentDTO): Promise<Appointment>;
}