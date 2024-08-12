import request from "supertest";
import { app } from "../../src/server.js";
import { JWT, ID_MAP } from "../../src/config.js";
import { waypointService } from "../../src/services/index.js";

describe("Waypoints API", () => {
  let waypointId;

  beforeEach(async () => {
    const createResponse = await request(app)
      .post("/api/v1/waypoints")
      .send({
        map_id: ID_MAP,
        position: {
          x: 5,
          y: 3,
        },
        name: "Test Waypoint",
      })
      .auth(JWT, { type: "bearer" });

    const { body } = createResponse;
    waypointId = body.data.id;
  });

  afterEach(async () => {
    if (waypointId) {
      await waypointService.deleteWaypointById(waypointService);
    }
  });

  it("should create a new waypoint", async () => {
    const response = await request(app)
      .send({
        map_id: ID_MAP,
        position: {
          x: 5,
          y: 3,
        },
        name: "New Waypoint",
      })
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(201);

    const { body } = response;
    expect(body.error).toBe(false);

    waypointId = body.data.id;
  });

  it("should get a waypoint by ID with the correct structure and 200 OK", async () => {
    const response = await request(app)
      .get(`/api/v1/waypoints/${waypointId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id", waypointId);
    expect(body.data).toHaveProperty("id_map");
    expect(body.data).toHaveProperty("position");
    expect(body.data.position).toHaveProperty("x");
    expect(body.data.position).toHaveProperty("y");
    expect(body.data).toHaveProperty("name");
  });

  it("should delete a waypoint and return status code 204", async () => {
    const deleteResponse = await request(app)
      .delete(`/api/v1/waypoints/${waypointId}`)
      .auth(JWT, { type: "bearer" });

    expect(deleteResponse.status).toBe(204);
  });

  it("should update the waypoint's position", async () => {
    const newPosition = {
      x: 10,
      y: 15,
    };

    const updateResponse = await request(app)
      .patch(`/api/v1/waypoints/${waypointId}`)
      .send({ position: newPosition })
      .auth(JWT, { type: "bearer" });

    expect(updateResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/waypoints/${waypointId}`)
      .auth(JWT, { type: "bearer" });

    expect(getResponse.status).toBe(200);

    const { body } = getResponse;
    expect(body.error).toBe(false);
  });
});
