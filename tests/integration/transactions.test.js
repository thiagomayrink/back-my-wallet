import '../../src/setup.js';
import app from '../../src/app.js';
import supertest from 'supertest';
import { afterAll, beforeEach } from '@jest/globals';

import {createToken, cleanDatabase, closeConnection} from '../utils/util.js';

beforeEach( async ()=>{
    await cleanDatabase();
}) 

afterAll ( async ()=>{
    await cleanDatabase();
    await closeConnection();
});

const agent = supertest(app);

const SignInbody = {
    name: 'test',
    email: 'test@email.com',
    password: '123456'
};

describe("GET /transactions", () => {

    it("should respond with status 200 when user provides a valid token", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
        
        const response = await agent.get("/transactions").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it("should return to the user all his transactions", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }

      await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);

      const response = await agent.get("/transactions").set('Authorization', `Bearer ${token}`);
  
      expect(response.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                amount: 1000,
                date: expect.any(String),
                description: body.description,
                id: expect.any(Number),
                type: 0,
                userId: expect.any(Number)
            })
        ])
      );
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const response = await agent.get("/transactions").set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(401);
      });

});
describe("POST /transactions", () => {

    it("should respond with status 201 when user provides a valid transaction", async () => {
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
    
        const response = await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toBe(201);
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }

        const response = await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(401);
    });

    it("should respond with status 400 when user provides an invalid amount", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
        const body = {
            amount: '',
            type: 0,
            description: "test transaction"
        }
        const response = await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(400);
    });

    it("should respond with status 400 when user provides an invalid type", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
        const body = {
            amount: 1000,
            type: "invalid_type",
            description: "test transaction"
        }
        const response = await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(400);
    });

});

describe("GET /balance", () => {

    it("should respond with status 200 when user provides a valid token", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);

        const response = await agent.get("/balance").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it("should respond with correct balance when user provides a valid token", async () => {
        const token = await createToken(SignInbody.name, SignInbody.email, SignInbody.password);
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }
        const body2 = {
            amount: 1000,
            type: 1,
            description: "test transaction"
        }

        await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
        await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
        await agent.post("/transactions").set('Authorization', `Bearer ${token}`).send(body2);

        const response = await agent.get("/balance").set('Authorization', `Bearer ${token}`);

        expect(response.body).toEqual(
            expect.objectContaining({
                balance: 1000
            })
        );
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const response = await agent.get("/balance").set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });
});