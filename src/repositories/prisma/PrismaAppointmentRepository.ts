import { Appointment } from "@prisma/client";
import { IAppointmentRepository } from "../../@types/repositories/AppointmentRepository";
import { prisma } from "../../prisma/client";
import { CreateAppointmentDTO } from "../../@types/dto/appointment/CreateAppointmentDTO";
import { UpdateAppointmentDTO } from "../../@types/dto/appointment/UpdateAppointmentDTO";

export interface AppointmentWithBarberName {
  id: string;
  clientName: string;
  totalPrice: number;
  date: Date;
  barberId: string;
  barberName: string;
  services: {
    name: string;
    price: number;
    commission: number | null;
  }[];
}

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findById(id: string): Promise<Appointment | null> {
    return prisma.appointment.findUnique({ where: { id } });
  }

  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        barberId: data.barberId,
        clientName: data.clientName,
        totalPrice: data.totalPrice,
        date: new Date(data.date),
        services: {
          create: data.services.map(service => ({
            name: service.name,
            price: service.price,
            commission: typeof service.commissionPercent === "number"
              ? service.commissionPercent
              : null,
          })),
        },
      },
      include: {
        services: true,
        barber: true,
      },
    });
  }

  async findByDate(date: string | Date, barberId: string): Promise<Appointment | null> {
    const dt = typeof date === "string" ? new Date(date) : date;
    return prisma.appointment.findFirst({
      where: {
        date: dt,
        barberId,
      }
    });
  }

  async findAll(): Promise<AppointmentWithBarberName[]> {
    const raws = await prisma.appointment.findMany({
      include: {
        barber: true,
        services: true
      },
      orderBy: { date: "asc" },
    });

    return raws.map((a) => ({
      id: a.id,
      clientName: a.clientName,
      totalPrice: a.totalPrice,
      date: a.date,
      barberId: a.barberId,
      barberName: a.barber.name,
      services: a.services.map(s => ({
        name: s.name,
        price: s.price,
        commission: s.commission ?? null,
      }))
    }));
  }

  async findAllByBarberId(barberId: string): Promise<AppointmentWithBarberName[]> {
    const raws = await prisma.appointment.findMany({
      where: { barberId },
      include: {
        barber: true,
        services: true
      },
      orderBy: { date: "asc" },
    });

    return raws.map((a) => ({
      id: a.id,
      clientName: a.clientName,
      totalPrice: a.totalPrice,
      date: a.date,
      barberId: a.barberId,
      barberName: a.barber.name,
      services: a.services.map(s => ({
        name: s.name,
        price: s.price,
        commission: s.commission ?? null,
      }))
    }));
  }


  async update(appointmentId: string, data: UpdateAppointmentDTO): Promise<Appointment> {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        clientName: data.clientName,
        date: data.date,
        totalPrice: data.totalPrice,
      },
    });

    await prisma.serviceItem.deleteMany({
      where: { appointmentId },
    });

    await prisma.serviceItem.createMany({
      data: data.services.map((s) => ({
        appointmentId,
        name: s.name,
        price: s.price,
        commission: s.commissionPercent ? s.commissionPercent / 100 : 0,
      })),
    });

    return prisma.appointment.findUniqueOrThrow({
      where: { id: appointmentId },
      include: {
        services: true,
        barber: true,
      },
    });
  }


  async delete(appointmentId: string): Promise<void> {
    await prisma.appointment.delete({
      where: { id: appointmentId }
    });
  }

  async findByDateRange(start: Date, end: Date): Promise<AppointmentWithBarberName[]> {
    const raws = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        barber: true,
        services: true
      },
    });

    return raws.map((a) => ({
      id: a.id,
      clientName: a.clientName,
      totalPrice: a.totalPrice,
      date: a.date,
      barberId: a.barberId,
      barberName: a.barber.name,
      services: a.services.map(s => ({
        name: s.name,
        price: s.price,
        commission: s.commission ?? null
      }))
    }));
  }

  async getSummaryByBarber(start: Date, end: Date): Promise<{ barberId: string; barberName: string; total: number }[]> {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        barber: true,
        services: true,
      },
    });

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      throw new Error("ADMIN user not found");
    }

    const summaryMap: Record<string, { barberName: string; total: number }> = {
      [admin.id]: { barberName: admin.name, total: 0 },
    };

    for (const apt of appointments) {
      for (const service of apt.services) {
        const commission = service.commission !== null && service.commission !== undefined
          ? service.commission
          : 1;
        const toBarber = service.price * commission;
        const toAdmin = service.price - toBarber;
        if (commission > 0) {
          if (!summaryMap[apt.barberId]) {
            summaryMap[apt.barberId] = {
              barberName: apt.barber.name,
              total: 0,
            };
          }
          summaryMap[apt.barberId].total += toBarber;
        }
        summaryMap[admin.id].total += toAdmin;
      }
    }

    return Object.entries(summaryMap).map(([barberId, data]) => ({
      barberId,
      barberName: data.barberName,
      total: data.total,
    }));
  }


  async findNext(limit: number): Promise<AppointmentWithBarberName[]> {
    const now = new Date();

    const raws = await prisma.appointment.findMany({
      where: {
        date: { gt: now },
      },
      include: {
        barber: true,
        services: true,
      },
      orderBy: { date: "asc" },
      take: limit,
    });

    return raws.map((a) => ({
      id: a.id,
      clientName: a.clientName,
      totalPrice: a.totalPrice,
      date: a.date,
      barberId: a.barberId,
      barberName: a.barber.name,
      services: a.services.map(s => ({
        name: s.name,
        price: s.price,
        commission: s.commission ?? null
      }))
    }));
  }

}