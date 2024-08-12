import request from "supertest";
import { app } from "../../src/server.js";
import { JWT, ID_USER } from "../../src/config.js";
import { mapService } from "../../src/services/index.js";

describe("Maps API", () => {
  let mapId;

  beforeEach(async () => {
    const createResponse = await request(app)
      .post("/api/v1/maps")
      .send({
        name: "Test Map",
        dimensions: {
          width: 100,
          height: 100,
        },
        obstacles: [{ x: 5, y: 3 }],
        user_id: ID_USER,
      })
      .auth(JWT, { type: "bearer" });

    const { body } = createResponse;
    mapId = body.data.id;
  });

  afterEach(async () => {
    if (mapId) {
      await mapService.deleteMapById(mapId);
    }
  });

  it("should create a new map", async () => {
    const response = await request(app)
      .post("/api/v1/maps")
      .send({
        name: "Another Test Map",
        dimensions: {
          width: 200,
          height: 150,
        },
        obstacles: [{ x: 10, y: 20 }],
        user_id: ID_USER,
      })
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("name", "Another Test Map");
    expect(body.data.dimensions).toEqual({
      width: 200,
      height: 150,
    });
    expect(body.data.obstacles).toEqual([{ x: 10, y: 20 }]);

    mapId = body.data.id;
  });

  it("should get a map by ID with the correct structure and 200 OK", async () => {
    const response = await request(app)
      .get(`/api/v1/maps/${mapId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.error).toBe(false);
    expect(body.data).toHaveProperty("id", mapId);
    expect(body.data).toHaveProperty("name");
    expect(body.data.dimensions).toHaveProperty("width");
    expect(body.data.dimensions).toHaveProperty("height");
    expect(body.data.obstacles).toBeInstanceOf(Array);
  });

  it("should update the map's name", async () => {
    const newName = "Updated Test Map";

    const updateResponse = await request(app)
      .patch(`/api/v1/maps/name/${mapId}`)
      .send({ name: newName })
      .auth(JWT, { type: "bearer" });

    expect(updateResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/maps/${mapId}`)
      .auth(JWT, { type: "bearer" });

    expect(getResponse.status).toBe(200);

    const { body } = getResponse;
    expect(body.error).toBe(false);
    expect(body.data.name).toEqual(newName);
  });

  it("should delete a map and return status code 204", async () => {
    const deleteResponse = await request(app)
      .delete(`/api/v1/maps/${mapId}`)
      .set("Authorization", `Bearer ${JWT}`);

    expect(deleteResponse.status).toBe(204);
  });
});
