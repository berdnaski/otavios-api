import Fastify from 'fastify';
import { userRoutes } from './routes/users';
import jwt from '@fastify/jwt';

const app = Fastify();

app.register(jwt, {
    secret: 'dpasojdasokfdasokfpsafopsak',
    sign: {
        expiresIn: '1h',
    }
});

app.register(userRoutes);

app.listen({ port: 3333 }).then(() => {
    console.log('Server is running on http://localhost:3333');
})