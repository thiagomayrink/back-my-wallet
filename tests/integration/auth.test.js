import '../../src/setup.js';
import supertest from 'supertest';
import { afterAll, beforeEach } from '@jest/globals';
import app from '../../src/app.js';

import { createUser } from '../factories/userFactory.js';
import { cleanDatabase, closeConnection } from '../utils/util.js';

beforeEach(async () => {
    await cleanDatabase();
});

afterAll(async () => {
    await closeConnection();
});

const agent = supertest(app);

describe('POST /sign-up', () => {
    const SignUpbody = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
    };

    it('should respond with status 201 for valid input and unique e-mail', async () => {
        const response = await agent.post('/sign-up').send(SignUpbody);

        expect(response.status).toBe(201);
    });

    it('should respond with status 409 for an already signed e-mail', async () => {
        await createUser(
            SignUpbody.name,
            SignUpbody.email,
            SignUpbody.password,
        );

        const response = await agent.post('/sign-up').send(SignUpbody);

        expect(response.status).toBe(409);
    });
});

describe('POST /sign-in', () => {
    const SignInbody = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
    };

    it('should respond with status 200 for a valid login input', async () => {
        await createUser(
            SignInbody.name,
            SignInbody.email,
            SignInbody.password,
        );

        const response = await agent
            .post('/sign-in')
            .send({ email: 'teste@email.com', password: '123456' });

        expect(response.status).toBe(200);
    });

    it('should return a token for valid login session', async () => {
        await createUser(
            SignInbody.name,
            SignInbody.email,
            SignInbody.password,
        );

        const response = await agent
            .post('/sign-in')
            .send({ email: 'teste@email.com', password: '123456' });

        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            }),
        );
    });

    it('should respond with status 401 when user exists but password is invalid', async () => {
        await createUser(
            SignInbody.name,
            SignInbody.email,
            SignInbody.password,
        );

        const response = await agent
            .post('/sign-in')
            .send({ email: SignInbody.email, password: 'invalid_password' });

        expect(response.status).toBe(401);
    });

    it("should respond with status 401 when user doesn't exist", async () => {
        await createUser(
            SignInbody.name,
            SignInbody.email,
            SignInbody.password,
        );

        const response = await agent.post('/sign-in').send({
            email: 'not_registered_email@email.com',
            password: SignInbody.password,
        });

        expect(response.status).toBe(401);
    });
});
