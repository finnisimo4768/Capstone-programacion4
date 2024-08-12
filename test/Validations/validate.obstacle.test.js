import request from "supertest";
import { app } from "../../src/server.js";
import { obstacleService } from "../../src/services/index.js";
import { JWT, ID_MAP } from "../../src/config.js";

let testObstacleId;

describe("Obstacle validation middlewares", () => {
  beforeAll(async () => {
    const obstacle = await obstacleService.createObstacle({
      map_id: ID_MAP,
      position: { x: 1, y: 1 },
    });
    testObstacleId = obstacle.id_obstacle;
  });

  afterAll(async () => {
    if (testObstacleId) {
      await obstacleService.deleteObstacleById(testObstacleId);
    }
  });

  it("should pass validateGetObstacle with a valid UUID", async () => {
    const response = await request(app)
      .get(`/api/v1/obstacles/${testObstacleId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body.data.position).toEqual({ x: 1, y: 1 });
  });

  it("should fail validateCreateObstacle if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/obstacles").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateCreateObstacle with valid fields", async () => {
    const response = await request(app)
      .post("/api/v1/obstacles")
      .send({
        map_id: ID_MAP,
        position: { x: 5, y: 5 },
      });
    expect(response.status).toBe(201);
    expect(response.body.data.position).toEqual({ x: 5, y: 5 });

    const id = response.body.data.id;

    await request(app)
      .delete(`/api/v1/obstacles/${id}`)
      .auth(JWT, { type: "bearer" });
  });

  it("should fail validateDeleteObstacle if id is not a valid UUID", async () => {
    const response = await request(app)
      .delete("/api/v1/obstacles/not-a-uuid")
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateDeleteObstacle with a valid UUID", async () => {
    const response = await request(app)
      .delete(`/api/v1/obstacles/${testObstacleId}`)
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(204);
  });

  it("should fail validateUpdateObstaclePosition if id is not a valid UUID or position is invalid", async () => {
    const response = await request(app)
      .patch("/api/v1/obstacles/position/not-a-uuid")
      .send({ position: { x: "invalid-x", y: "invalid-y" } })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateUpdateObstaclePosition with valid fields", async () => {
    const response = await request(app)
      .patch(`/api/v1/obstacles/position/${testObstacleId}`)
      .send({ position: { x: 10, y: 10 } })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body.data.position).toEqual({ x: 10, y: 10 });
  });
});
