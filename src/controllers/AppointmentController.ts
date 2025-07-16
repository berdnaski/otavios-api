import { FastifyReply, FastifyRequest } from "fastify";
import { CreateAppointmentDTO } from "../@types/dto/appointment/CreateAppointmentDTO";
import { PrismaAppointmentRepository } from "../repositories/prisma/PrismaAppointmentRepository";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { CreateAppointmentUseCase } from "../usecases/appointments/create-appointment";
import { SummaryAppointmentsUseCase } from "../usecases/appointments/summary-appointments";
import { zonedTimeToUtc } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";
import { SummaryByBarberUseCase } from "../usecases/appointments/summary-by-barber";
import { NextAppointmentsUseCase } from "../usecases/appointments/next-appointments";
import { UpdateAppointmentDTO } from "../@types/dto/appointment/UpdateAppointmentDTO";

export class AppointmentController {
  async create(req: FastifyRequest<{ Body: CreateAppointmentDTO }>, reply: FastifyReply) {
    try {
      const appointmentRepository = new PrismaAppointmentRepository();
      const userRepository = new PrismaUserRepository();
      const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository, userRepository);

      const appointment = await createAppointmentUseCase.execute(req.body);
      return reply.status(201).send(appointment);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao criar o agendamento.",
      });
    }
  }

  async findAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const appointmentRepository = new PrismaAppointmentRepository();
      const appointments = await appointmentRepository.findAll();
      return reply.status(200).send(appointments);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao buscar os agendamentos.",
      });
    }
  }

  async findAllByBarberId(barberId: string, req: FastifyRequest, reply: FastifyReply) {
    try {
      const appointmentRepository = new PrismaAppointmentRepository();
      const appointments = await appointmentRepository.findAllByBarberId(barberId);
      return reply.status(200).send(appointments);
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao buscar os agendamentos do barbeiro.",
      });
    }
  }

async update(req: FastifyRequest<{ Params: { appointmentId: string }, Body: CreateAppointmentDTO }>, reply: FastifyReply) {
  try {
    const { appointmentId } = req.params;
    const body = req.body;

    const updateDTO: UpdateAppointmentDTO = {
      clientName: body.clientName,
    date: new Date(body.date), 
    totalPrice: body.totalPrice,
      services: body.services,
    };

    const appointmentRepository = new PrismaAppointmentRepository();
    const updatedAppointment = await appointmentRepository.update(appointmentId, updateDTO);

    return reply.status(200).send(updatedAppointment);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message || "Erro ao atualizar o agendamento.",
    });
  }
}

  async delete(req: FastifyRequest<{ Params: { appointmentId: string } }>, reply: FastifyReply) {
    try {
      const { appointmentId } = req.params;
      const appointmentRepository = new PrismaAppointmentRepository();
      await appointmentRepository.delete(appointmentId);
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({
        message: error.message || "Erro ao deletar o agendamento.",
      });
    }
  }

async summary(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { date } = req.query as { date?: string };
    if (!date) {
      return reply.status(400).send({ message: "Parâmetro 'date' é obrigatório" });
    }

    const [year, month, day] = date.split('-').map(Number);
    
    const startOfDayInSaoPaulo = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDayInSaoPaulo = new Date(year, month - 1, day, 23, 59, 59, 999);

    const start = zonedTimeToUtc(startOfDayInSaoPaulo, 'America/Sao_Paulo');
    const end = zonedTimeToUtc(endOfDayInSaoPaulo, 'America/Sao_Paulo');

    const appointmentRepository = new PrismaAppointmentRepository();
    const summaryUseCase = new SummaryAppointmentsUseCase(appointmentRepository);
const summary = await summaryUseCase.execute(start, end);
return reply.status(200).send(summary);
  } catch (error: any) {
    return reply.status(500).send({
      message: error.message || "Erro ao gerar o resumo.",
    });
  }
}

async summaryRange(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { start, end } = req.query as { start?: string, end?: string };
    if (!start || !end) {
      return reply.status(400).send({ message: "Parâmetros 'start' e 'end' são obrigatórios" });
    }

    const startDate = zonedTimeToUtc(new Date(start + "T00:00:00"), 'America/Sao_Paulo');
    const endDate = zonedTimeToUtc(new Date(end + "T23:59:59"), 'America/Sao_Paulo');

    const repo = new PrismaAppointmentRepository();
    const usecase = new SummaryAppointmentsUseCase(repo);
    const summary = await usecase.execute(startDate, endDate);

    return reply.status(200).send(summary);
  } catch (error: any) {
    return reply.status(500).send({ message: error.message || "Erro ao gerar resumo por intervalo." });
  }
}

async summaryByBarber(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { start, end } = req.query as { start?: string, end?: string };

    if (!start || !end) {
      return reply.status(400).send({ message: "Parâmetros 'start' e 'end' são obrigatórios" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointmentRepository = new PrismaAppointmentRepository();
    const useCase = new SummaryByBarberUseCase(appointmentRepository);

    const result = await useCase.execute(startDate, endDate);

    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(500).send({
      message: error.message || "Erro ao gerar resumo por barbeiro",
    });
  }
}

async next(req: FastifyRequest, reply: FastifyReply) {
  console.log("[Controller] GET /appointments/next");

  try {
    const appointmentRepository = new PrismaAppointmentRepository();
    const usecase = new NextAppointmentsUseCase(appointmentRepository);
    const result = await usecase.execute(3);

    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(500).send({
      message: error.message || "Erro ao buscar próximos agendamentos",
    });
  }
}

}
