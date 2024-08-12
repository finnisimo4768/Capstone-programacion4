import request from "supertest";
import { app } from "../../src/server.js";
import { mapService } from "../../src/services/index.js";
import { JWT, ID_USER } from "../../src/config.js";

let testMapId;

describe("Map validation middlewares", () => {
  beforeAll(async () => {
    const map = await mapService.createMap({
      name: "testmap",
      user_id: ID_USER,
      dimensions: { width: 10, height: 10 },
      obstacles: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    });
    testMapId = map.id_map;
  });

  afterAll(async () => {
    if (testMapId) {
      await mapService.deleteMapById(testMapId);
    }
  });

  it("should pass validateGetMap with a valid UUID", async () => {
    const response = await request(app)
      .get(`/api/v1/maps/${testMapId}`)
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("testmap");
  });

  it("should fail validateCreateMap if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/maps").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateCreateMap with valid fields", async () => {
    const response = await request(app)
      .post("/api/v1/maps")
      .send({
        name: "newmap",
        user_id: ID_USER,
        dimensions: { width: 20, height: 20 },
        obstacles: [{ x: 5, y: 5 }],
      });
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("newmap");

    const id = response.body.data.id;

    await request(app)
      .delete(`/api/v1/maps/${id}`)
      .auth(JWT, { type: "bearer" });
  });

  it("should fail validateDeleteMap if id is not a valid UUID", async () => {
    const response = await request(app)
      .delete("/api/v1/maps/not-a-uuid")
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateDeleteMap with a valid UUID", async () => {
    const response = await request(app)
      .delete(`/api/v1/maps/${testMapId}`)
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(204);
  });

  it("should fail validateUpdateMapDimensions if id is not a valid UUID or dimensions are invalid", async () => {
    const response = await request(app)
      .patch("/api/v1/maps/dimensions/not-a-uuid")
      .send({
        dimensions: { width: "invalid-width", height: "invalid-height" },
      })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateUpdateMapDimensions with valid fields", async () => {
    const response = await request(app)
      .patch(`/api/v1/maps/dimensions/${testMapId}`)
      .send({ dimensions: { width: 15, height: 15 } })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body.data.dimensions.width).toBe(15);
    expect(response.body.data.dimensions.height).toBe(15);
  });

  it("should fail validateUpdateMapName if id is not a valid UUID or name is empty", async () => {
    const response = await request(app)
      .patch("/api/v1/maps/name/not-a-uuid")
      .send({ name: "" })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should pass validateUpdateMapName with valid fields", async () => {
    const response = await request(app)
      .patch(`/api/v1/maps/name/${testMapId}`)
      .send({ name: "updatedmapname" })
      .auth(JWT, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("updatedmapname");
  });
});
