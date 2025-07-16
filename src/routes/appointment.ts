import { FastifyInstance } from "fastify";
import { AppointmentController } from "../controllers/AppointmentController";
import { CreateAppointmentDTO } from "../@types/dto/appointment/CreateAppointmentDTO";
import { isAuth } from "../middlewares/isAuth";

export async function appointmentRoutes(app: FastifyInstance) {
    const appointmentController = new AppointmentController();

    app.register(async (app) => {
        app.addHook("onRequest", isAuth);

        app.get("/appointments/summary", async (req, reply) => {
            await appointmentController.summary(req, reply);
        });

        app.get("/appointments/summary-range", async (req, reply) => {
            await appointmentController.summaryRange(req, reply);
        });

        app.get("/appointments/next", async (req, reply) => {
            await appointmentController.next(req, reply);
        });

        app.get("/appointments/summary-by-barber", async (req, reply) => {
            await appointmentController.summaryByBarber(req, reply);
        });

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

        app.delete<{ Params: { appointmentId: string } }>("/appointments/:appointmentId", async (req, reply) => {
            await appointmentController.delete(req, reply);
        });
    });
}