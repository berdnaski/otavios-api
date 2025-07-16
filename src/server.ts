import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth';
import { usersRoutes } from './routes/users';
import { appointmentRoutes } from './routes/appointment';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify();

app.register(cors, {
  origin: true,
});

app.register(fastifyCookie);

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
});

app.register(authRoutes);
app.register(usersRoutes);
app.register(appointmentRoutes);

const port = Number(process.env.PORT) || 3333;

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`✅ Server is running on http://0.0.0.0:${port}`);
});
