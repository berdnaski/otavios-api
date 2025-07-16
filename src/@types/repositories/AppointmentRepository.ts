import { Appointment } from "@prisma/client";
import { CreateAppointmentDTO } from "../dto/appointment/CreateAppointmentDTO";
import { UpdateAppointmentDTO } from "../dto/appointment/UpdateAppointmentDTO";
import { AppointmentWithBarberName } from "../../repositories/prisma/PrismaAppointmentRepository";

export interface IAppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    create(data: CreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date, barberId: string): Promise<Appointment | null>;
    findAll(): Promise<AppointmentWithBarberName[]>;
    findAllByBarberId(barberId: string): Promise<AppointmentWithBarberName[]>;
    update(appointmentId: string, data: UpdateAppointmentDTO): Promise<Appointment>;
    delete(appointmentId: string): Promise<void>;
    findByDateRange(start: Date, end: Date): Promise<AppointmentWithBarberName[]>;
    getSummaryByBarber(start: Date, end: Date): Promise<{ barberId: string; barberName: string; total: number }[]>
    findNext(limit: number): Promise<AppointmentWithBarberName[]>
}