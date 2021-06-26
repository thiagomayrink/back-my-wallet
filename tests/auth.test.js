import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import { afterAll, beforeEach } from '@jest/globals';

describe("POST /sign-up", () => {
    it("should respond with status 201 when there is no user with given email", async () => {
      const body = {
        name: 'test',
        email: 'test@email.com',
        password: '123456'
      };
  
      const response = await supertest(app).post("/sign-up").send(body);
  
      expect(response.status).toEqual(201);
    });
  
    it("should respond with status 409 when there already is an user with given email", async () => {
      const body = {
        name: 'test',
        email: 'test@email.com',
        password: '123456'
      };
  
      await connection.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [body.name, body.email, body.password]);
      const response = await supertest(app).post("/sign-up").send(body);
  
      expect(response.status).toEqual(409);
    });
  });
  
  describe("POST /sign-in", () => {
    it("should respond with status 200 when user exists and password is valid", async () => {
      const body = {
        name: "test",
        email: "test@email.com",
        password: "123456"
      };
  
      await supertest(app).post("/sign-up").send(body);
      const response = await supertest(app).post("/sign-in").send({ email: body.email, password: body.password });
  
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });
  
    it("should respond with status 401 when user exists but password is invalid", async () => {
      const body = {
        name: "test",
        email: "test@email.com",
        password: "123456"
      };
  
      await supertest(app).post("/sign-up").send(body);
  
      const response = await supertest(app).post("/sign-in").send({ email: body.email, password: "invalid_password" });

      expect(response.status).toEqual(401);
    });
  
    it("should respond with status 401 when user doesn't exist", async () => {
      const body = {
        name: "test",
        email: "test@email.com",
        password: "123456"
      };
  
      await supertest(app).post("/sign-up").send(body);
  
      const response = await supertest(app).post("/sign-in").send({ email: "not_registered_email@email.com", password: "invalid_password" });
  
      expect(response.status).toEqual(401);
    });
  });

beforeEach(async ()=>{
    await connection.query(`DELETE FROM users`);
}) 

afterAll (()=>{
    connection.end();
});