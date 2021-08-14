import '../../src/setup.js';
import supertest from 'supertest';
import { afterAll, beforeEach } from '@jest/globals';
import app from '../../src/app.js';

import { createUser } from '../factories/userFactory.js';
import { cleanDatabase, closeConnection, createToken } from '../utils/util.js';

const agent = supertest(app);

const signBody = {
    name: 'test',
    email: 'test@email.com',
    password: '123456',
};

beforeEach(async () => {
    await cleanDatabase();
    await createUser(signBody.name, signBody.email, signBody.password);
});

afterAll(async () => {
    await closeConnection();
});

describe('POST /sign-up', () => {
    it('should respond with status 201 for valid input and unique e-mail', async () => {
        await cleanDatabase();
        const response = await agent.post('/sign-up').send(signBody);

        expect(response.status).toBe(201);
    });

    it('should respond with status 409 for an already signed e-mail', async () => {
        const response = await agent.post('/sign-up').send(signBody);

        expect(response.status).toBe(409);
    });
});

describe('POST /sign-in', () => {
    it('should respond with status 200 for a valid login input', async () => {
        const response = await agent
            .post('/sign-in')
            .send({ email: signBody.email, password: signBody.password });

        expect(response.status).toBe(200);
    });

    it('should return a token for valid login session', async () => {
        const response = await agent
            .post('/sign-in')
            .send({ email: signBody.email, password: signBody.password });

        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            }),
        );
    });

    it('should respond with status 401 when user exists but password is invalid', async () => {
        const response = await agent
            .post('/sign-in')
            .send({ email: signBody.email, password: 'invalid_password' });

        expect(response.status).toBe(401);
    });

    it("should respond with status 401 when user doesn't exist", async () => {
        const response = await agent.post('/sign-in').send({
            email: 'not_registered_email@email.com',
            password: signBody.password,
        });

        expect(response.status).toBe(401);
    });
});

describe('POST /sign-out', () => {
    it('should respond with status 200 for valid token', async () => {
        await cleanDatabase();

        const token = await createToken(
            signBody.name,
            signBody.email,
            signBody.password,
        );

        const response = await agent
            .post('/sign-out')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should respond with status 401 for empty token', async () => {
        const token = '';

        const response = await agent
            .post('/sign-out')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });
});
