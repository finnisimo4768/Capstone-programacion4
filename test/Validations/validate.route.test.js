import request from "supertest";
import { app } from "../../src/server.js";
import { waypointService } from "../../src/services/index.js";
import { JWT, ID_MAP } from "../../src/config.js";

let testWaypointId;

describe("Waypoint validation middlewares", () => {
  beforeAll(async () => {
    const waypoint = await waypointService.createWaypoint({
      map_id: ID_MAP, // Usando ID_MAP desde la configuración
      position: { x: 1, y: 1 },
      name: "Test Waypoint",
    });
    testWaypointId = waypoint.id_waypoint;
  });

  afterAll(async () => {
    if (testWaypointId) {
      await waypointService.deleteWaypointById(testWaypointId);
    }
  });

  it("should pass validateGetWaypoint with a valid UUID", async () => {
    const response = await request(app)
      .get(`/api/v1/waypoints/${testWaypointId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Test Waypoint");
  });

  it("should fail validateCreateWaypoint if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/waypoints").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateCreateWaypoint with valid fields", async () => {
    const response = await request(app)
      .post("/api/v1/waypoints")
      .send({
        map_id: ID_MAP, // Usando ID_MAP desde la configuración
        position: { x: 2, y: 2 },
        name: "New Waypoint",
      });
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("New Waypoint");

    const id = response.body.data.id;

    await request(app)
      .delete(`/api/v1/waypoints/${id}`)
      .auth(JWT, { type: "bearer" });
  });

  it("should fail validateDeleteWaypoint if id is not a valid UUID", async () => {
    const response = await request(app)
      .delete("/api/v1/waypoints/not-a-uuid")
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateDeleteWaypoint with a valid UUID", async () => {
    const response = await request(app)
      .delete(`/api/v1/waypoints/${testWaypointId}`)
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(204);
  });

  it("should fail validateUpdateWaypointPosition if id is not a valid UUID or position is invalid", async () => {
    const response = await request(app)
      .patch("/api/v1/waypoints/position/not-a-uuid")
      .send({ position: { x: "invalid-x", y: "invalid-y" } })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateUpdateWaypointPosition with valid fields", async () => {
    const response = await request(app)
      .patch(`/api/v1/waypoints/position/${testWaypointId}`)
      .send({ position: { x: 10, y: 10 } })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body.data.position).toEqual({ x: 10, y: 10 });
  });
});
