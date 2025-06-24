import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserController } from "../controllers/UserController";
import { isAuth } from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdmin";

export async function usersRoutes(app: FastifyInstance) {
    const userController = new UserController();

    app.register(async (app) => {
        app.addHook("onRequest", isAuth);

        app.get("/users/", async (req: FastifyRequest, reply: FastifyReply) => {
            await userController.findAll(reply);
        });

        app.put(
            "/users/:userId/commission",
            async (req, reply) => {
                await isAdmin(req, reply);
                await userController.updateCommission(req, reply);
            }
        );

        app.get(
            "/users/:ident",
            async (
                req: FastifyRequest<{ Params: { ident: string } }>,
                reply: FastifyReply
            ) => {
                await userController.findOne(req, reply);
            }
        );
    });
}
