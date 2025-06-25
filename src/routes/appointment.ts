import { FastifyInstance } from "fastify";
import { AppointmentController } from "../controllers/AppointmentController";
import { CreateAppointmentDTO } from "../@types/dto/appointment/CreateAppointmentDTO";
import { isAuth } from "../middlewares/isAuth";

export async function appointmentRoutes(app: FastifyInstance) {
    const appointmentController = new AppointmentController();

    app.register(async (app) => {
        app.addHook("onRequest", isAuth);

        app.post<{ Body: CreateAppointmentDTO }>("/appointments", async (req, reply) => {
            await appointmentController.create(req, reply);
        })

        app.get("/appointments", async (req, reply) => {
            await appointmentController.findAll(req, reply);
        })

        app.get("/appointments/:barberId", async (req, reply) => {
            const { barberId } = req.params as { barberId: string };
            await appointmentController.findAllByBarberId(barberId, req, reply);
        })

        app.put<{ Params: { appointmentId: string }, Body: CreateAppointmentDTO }>("/appointments/:appointmentId", async (req, reply) => {
            await appointmentController.update(req, reply);
        })
    });
}