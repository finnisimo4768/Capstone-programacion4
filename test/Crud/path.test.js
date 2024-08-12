import { PrismaClient } from "@prisma/client";
import { calculatePath } from "../../src/utils/Dijkstra/pathFinder.js";
import { formats } from "../../src/utils/formatters.js";
import pathService from "../../src/services/index.js";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    map: {
      findUnique: jest.fn(),
    },
    path: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    route: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("pathService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createOptimalPath - should calculate path and save it", async () => {
    const mockMap = {
      obstacles: [{ x: 1, y: 1 }],
      waypoints: [{ x: 0, y: 0 }],
      routes: [{ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }],
    };

    prisma.map.findUnique.mockResolvedValue(mockMap);
    calculatePath.mockReturnValue([
      [0, 0],
      [1, 1],
    ]);

    const result = await pathService.createOptimalPath(1);

    expect(prisma.map.findUnique).toHaveBeenCalledWith({
      where: { id_map: 1 },
      include: { obstacles: true, waypoints: true, routes: true },
    });
    expect(calculatePath).toHaveBeenCalledWith(formats.formattedPath(mockMap));
    expect(result).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  test("getPathById - should return path by ID", async () => {
    const mockPath = { id_path: 1, path: "[]" };
    prisma.path.findUnique.mockResolvedValue(mockPath);

    const result = await pathService.getPathById(1);

    expect(prisma.path.findUnique).toHaveBeenCalledWith({
      where: { id_path: 1 },
    });
    expect(result).toEqual(mockPath);
  });
});
