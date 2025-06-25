import { Appointment } from "@prisma/client";
import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";
import { prisma } from "../../prisma/client";
import { CreateAppointmentDTO } from "../../@types/dto/appointment/CreateAppointmentDTO";
import { UpdateAppointmentDTO } from "../../@types/dto/appointment/UpdateAppointmentDTO";

export class PrismaAppointmentRepository implements IAppointmentRepository {
    async findById(id: string): Promise<Appointment | null> {
        return prisma.appointment.findUnique({ where: { id } });
    }

    async create(data: CreateAppointmentDTO): Promise<Appointment> {
        return prisma.appointment.create({
            data: {
                barberId: data.barberId,
                clientName: data.clientName,
                service: data.service,
                price: data.price,
                date: data.date,
            }
        })
    }

    async findByDate(date: Date, barberId: string): Promise<Appointment | null> {
        return prisma.appointment.findFirst({
            where: {
                date: date,
                barberId: barberId,
            }
        })
    }

    async findAll(): Promise<Appointment[]> {
        return prisma.appointment.findMany()
    }

    async findAllByBarberId(barberId: string): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: {
                barberId: barberId,
            }
        })
    }

    async update(appointmentId: string, data: UpdateAppointmentDTO): Promise<Appointment> {
        return prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                clientName: data.clientName,
                service: data.service,
                price: data.price,
                date: data.date,
            }
        })
    }
}