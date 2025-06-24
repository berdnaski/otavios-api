import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth';
import { usersRoutes } from './routes/users';

const app = Fastify();

app.register(jwt, {
    secret: 'dpasojdasokfdasokfpsafopsak',
    sign: {
        expiresIn: '1h',
    }
});

app.register(authRoutes);
app.register(usersRoutes);

app.listen({ port: 3333 }).then(() => {
    console.log('Server is running on http://localhost:3333');
})