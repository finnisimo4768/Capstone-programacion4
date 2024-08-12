import request from "supertest";
import { app } from "../../src/server.js";

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUwNDEyZDA4LWIwMTktNDY2ZS04NzE4LTIyMWVkYmZmZDIzMiIsInVzZXJuYW1lIjoiRmlubmlzaW1vIiwiZW1haWwiOiJmaW5uaXNpbW80NzY4QGdtYWlsLmNvbSIsImlhdCI6MTcyMjg0OTA1MCwiZXhwIjoxNzIyOTM1NDUwfQ.m_KdKbO7VLPAJIzMFEbP8GoZV65Bw6ieo4vfB6AAiw0";

describe("User Validation Middleware with Authorization", () => {
  it("should return 401 for missing Authorization header in GET /user/:id", async () => {
    const response = await request(app).get("/api/v1/users/valid-uuid");
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid id in validateGetUser", async () => {
    const response = await request(app)
      .get("/api/v1/users/invalid-uuid")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(400);
  });

  it("should return 400 for invalid data in validateCreateUser", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ username: "", password: "", email: "invalid-email" });
    expect(response.status).toBe(400);
  });

  it("should return 401 for missing Authorization header in DELETE /user/:id", async () => {
    const response = await request(app).delete("/api/v1/users/valid-uuid");
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid id in validateDeleteUser", async () => {
    const response = await request(app)
      .delete("/api/v1/users/invalid-uuid")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(400);
  });

  it("should return 401 for missing Authorization header in PATCH /user/email/:id", async () => {
    const response = await request(app)
      .patch("/api/v1/users/email/valid-uuid")
      .send({ email: "new-email@example.com" });
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid email in validateUpdateUserEmail", async () => {
    const response = await request(app)
      .patch("/api/v1/users/email/invalid-uuid")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ email: "invalid-email" });
    expect(response.status).toBe(400);
  });

  it("should return 401 for missing Authorization header in PATCH /user/password/:id", async () => {
    const response = await request(app)
      .patch("/api/v1/users/password/valid-uuid")
      .send({ password: "newpassword" });
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid password in validateUpdateUserPassword", async () => {
    const response = await request(app)
      .patch("/api/v1/users/password/invalid-uuid")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ password: "" });
    expect(response.status).toBe(400);
  });
});
