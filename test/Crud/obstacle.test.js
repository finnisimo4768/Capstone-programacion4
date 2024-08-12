import request from "supertest";
import { app } from "../../src/server.js";
import { JWT, ID_MAP } from "../../src/config.js";
import { obstacleService } from "../../src/services/index.js";

describe("Obstacles API", () => {
  let obstacleId;

  beforeEach(async () => {
    const createResponse = await request(app)
      .post("/api/v1/obstacles")
      .send({
        map_id: ID_MAP,
        position: {
          x: 5,
          y: 3,
        },
      })
      .auth(JWT, { type: "bearer" });

    const { body } = createResponse;
    obstacleId = body.data.id;
  });

  afterEach(async () => {
    if (obstacleId) {
      await obstacleService.deleteObstacleById(obstacleId);
    }
  });

  it("should create a new obstacle", async () => {
    const response = await request(app)
      .post("/api/v1/obstacles")
      .send({
        map_id: ID_MAP,
        position: {
          x: 5,
          y: 3,
        },
      })
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(201);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("id_map", ID_MAP);
    expect(body.data.position).toEqual({
      x: 5,
      y: 3,
    });

    obstacleId = body.data.id;
  });

  it("should get an obstacle by ID with the correct structure and 200 OK", async () => {
    const response = await request(app)
      .get(`/api/v1/obstacles/${obstacleId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id", obstacleId);
    expect(body.data).toHaveProperty("id_map");
    expect(body.data).toHaveProperty("position");
    expect(body.data.position).toHaveProperty("x");
    expect(body.data.position).toHaveProperty("y");
  });

  it("should delete an obstacle and return status code 204", async () => {
    console.log("Deleting obstacle with ID:", obstacleId);

    const deleteResponse = await request(app)
      .delete(`/api/v1/obstacles/${obstacleId}`)
      .set("Authorization", `Bearer ${JWT}`);

    console.log("Delete response status:", deleteResponse.status);
    console.log("Delete response body:", deleteResponse.body);

    expect(deleteResponse.status).toBe(204);
  });
  it("should update the obstacle's position", async () => {
    const newPosition = {
      x: 10,
      y: 15,
    };

    const updateResponse = await request(app)
      .patch(`/api/v1/obstacles/${obstacleId}`)
      .send({ position: newPosition })
      .auth(JWT, { type: "bearer" });

    expect(updateResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/obstacles/${obstacleId}`)
      .auth(JWT, { type: "bearer" });

    expect(getResponse.status).toBe(200);

    const { body } = getResponse;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id", obstacleId);
    expect(body.data.position).toEqual(newPosition);
  });
});
