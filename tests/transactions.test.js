import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import { afterAll, beforeEach } from '@jest/globals';
import {login} from './util.js';

describe("GET /transactions", () => {

    it("should respond with status 200 when user provides a valid token", async () => {
        const token = await login();
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }

      await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);

      const response = await supertest(app).get("/transactions").set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                amount: 1000,
                date: expect.any(String),
                description: "test transaction",
                id: expect.any(Number),
                type: 0,
                userId: expect.any(Number)
            })
        ])
      );
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const response = await supertest(app).get("/transactions").set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(401);
      });

});
describe("POST /transactions", () => {

    it("should respond with status 201 when user provides a valid transaction", async () => {
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }
        const token = await login();
    
        const response = await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(201);
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const body = {
            amount: 1000,
            type: 0,
            description: "test transaction"
        }

        const response = await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toEqual(401);
    });

    it("should respond with status 400 when user provides an invalid amount or type", async () => {
        const token = await login();
        const body = {
            amount: '',
            type: 0,
            description: "test transaction"
        }
        const response = await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toEqual(400);
    });

});

describe("GET /balance", () => {

    it("should respond with status 200 when user provides a valid token", async () => {
        const token = await login();
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

        await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
        await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body);
        await supertest(app).post("/transactions").set('Authorization', `Bearer ${token}`).send(body2);

        const response = await supertest(app).get("/balance").set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                balance: 1000
            })
        );
    });

    it("should respond with status 401 when user provides an invalid token", async () => {
        const token = 'invalid_token';
        const response = await supertest(app).get("/balance").set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(401);
    });
});

beforeEach( async ()=>{
    await connection.query(`DELETE FROM users`);
    await connection.query(`DELETE FROM transactions`);
    await connection.query(`DELETE FROM sessions`);
}) 

afterAll ( async ()=>{
    await connection.query(`DELETE FROM users`);
    await connection.query(`DELETE FROM transactions`);
    await connection.query(`DELETE FROM sessions`);
    connection.end();
});