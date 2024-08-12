import request from "supertest";
import { app } from "../../src/server.js";
import { JWT, ID_MAP } from "../../src/config.js";
import { routeService } from "../../src/services/index.js";

describe("Route API", () => {
  let routeId;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/v1/routes")
      .auth(JWT, { type: "bearer" })
      .send({
        map_id: ID_MAP,
        start: { x: 2, y: 2 },
        end: { x: 8, y: 8 },
        distance: 15,
      });

    const { body } = response;
    routeId = body.data.id;
  });

  afterEach(async () => {
    if (routeId) {
      await routeService.deleteRouteById(routeId);
    }
  });

  it("should return a route by ID with the correct structure and 200 OK", async () => {
    const response = await request(app)
      .get(`/api/v1/routes/${routeId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id_map", ID_MAP);
    expect(body.data).toHaveProperty("start");
    expect(body.data.start).toHaveProperty("x", 2);
    expect(body.data.start).toHaveProperty("y", 2);
    expect(body.data).toHaveProperty("end");
    expect(body.data.end).toHaveProperty("x", 8);
    expect(body.data.end).toHaveProperty("y", 8);
    expect(body.data).toHaveProperty("distance", 15);
  });

  it("should create a route and return it with status 201", async () => {
    const response = await request(app)
      .post("/api/v1/routes")
      .auth(JWT, { type: "bearer" })
      .send({
        map_id: ID_MAP,
        start: { x: 1, y: 1 },
        end: { x: 11, y: 11 },
        distance: 20,
      });

    expect(response.status).toBe(201);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id_map", ID_MAP);
    expect(body.data).toHaveProperty("start");
    expect(body.data.start).toHaveProperty("x", 1);
    expect(body.data.start).toHaveProperty("y", 1);
    expect(body.data).toHaveProperty("end");
    expect(body.data.end).toHaveProperty("x", 11);
    expect(body.data.end).toHaveProperty("y", 11);
    expect(body.data).toHaveProperty("distance", 20);

    await request(app)
      .delete(`/api/v1/routes/${body.data.id}`)
      .auth(JWT, { type: "bearer" });
  });

  it("should delete a route and return status 204", async () => {
    const response = await request(app)
      .delete(`/api/v1/routes/${routeId}`)
      .set("Authorization", `Bearer ${JWT}`)
      .send({ distance: 25 });

    expect(response.status).toBe(204);
  });

  it("should update the distance of a route and return the updated route with status 200", async () => {
    const updateResponse = await request(app)
      .patch(`/api/v1/routes/distance/${routeId}`)
      .set("Authorization", `Bearer ${JWT}`)
      .send({ distance: 25 });

    expect(updateResponse.status).toBe(200);

    const { body: updateBody } = updateResponse;
    expect(updateBody.error).toBe(false);
  });
});
