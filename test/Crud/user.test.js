import request from "supertest";
import { app } from "../../src/server.js";
import { JWT, ID_USER } from "../../src/config.js";

describe("POST api/v1/users", () => {
  it("should return the a user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      username: "testfinnisimo",
      password: "finnisimo",
      email: "finnisimotest@gmail.com",
    });

    expect(response.status).toBe(201);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id_user");
    expect(body.data).toHaveProperty("username", "testfinnisimo");
    expect(body.data).toHaveProperty("email", "finnisimotest@gmail.com");

    const id = body.data.id_user;

    await request(app)
      .delete(`/api/v1/users/${id}`)
      .auth(JWT, { type: "bearer" });
  });
  it("should return a user by ID with the correct structure and 200 OK", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${ID_USER}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id_user", ID_USER);
    expect(body.data).toHaveProperty("username");
    expect(body.data).toHaveProperty("password");
    expect(body.data).toHaveProperty("email");

    expect(body.data.username).toBe("Finnisimo");
    expect(body.data.email).toBe("finnisimo4768@gmail.com");
  });
  it("should send a status code 204 when the user is deleted", async () => {
    const response = await request(app).post("/api/v1/users").send({
      username: "testfinnisimo",
      password: "finnisimo",
      email: "finnisimotest@gmail.com",
    });

    const { body } = response;

    const id = body.data.id_user;

    const deleteResponse = await request(app)
      .delete(`/api/v1/users/${id}`)
      .auth(JWT, { type: "bearer" });

    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.body).toEqual({});
  });
  it("should send a status code 200 and change the email when it is updated", async () => {
    const createResponse = await request(app).post("/api/v1/users").send({
      username: "testfinnisimo",
      password: "finnisimo",
      email: "finnisimotest@gmail.com",
    });

    const { body: createBody } = createResponse;
    const id = createBody.data.id_user;

    const updateResponse = await request(app)
      .patch(`/api/v1/users/email/${id}`)
      .send({ email: "new@gmail.com" })
      .auth(JWT, { type: "bearer" });

    expect(updateResponse.status).toBe(200);

    await request(app)
      .delete(`/api/v1/users/${id}`)
      .auth(JWT, { type: "bearer" });
  });
});
