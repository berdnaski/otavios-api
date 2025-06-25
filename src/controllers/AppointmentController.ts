import { FastifyReply, FastifyRequest } from "fastify";
import { CreateAppointmentDTO } from "../@types/dto/appointment/CreateAppointmentDTO";
import { PrismaAppointmentRepository } from "../repositories/prisma/PrismaAppointmentRepository";
import { CreateAppointmentUseCase } from "../usecases/appointments/create-appointment";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";

export class AppointmentController {
    async create(req: FastifyRequest<{ Body: CreateAppointmentDTO}>, reply: FastifyReply) {
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
            const appointmentRepository = new PrismaAppointmentRepository();
            const updatedAppointment = await appointmentRepository.update(appointmentId, req.body);

            return reply.status(200).send(updatedAppointment);
        } catch (error: any) {
            return reply.status(400).send({
                message: error.message || "Erro ao atualizar o agendamento.",
            });
        }
    }
}