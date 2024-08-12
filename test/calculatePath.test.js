import { calculatePath } from "../src/utils/Dijkstra/pathFinder.js";
import {
  createMap,
  addObstaclesToMap,
  addWaypointsToMap,
} from "../src/utils/Dijkstra/map.js";
import { findShortestPath } from "../src/utils/Dijkstra/dijkstra.js";

jest.mock("../src/utils/Dijkstra/map.js", () => ({
  createMap: jest.fn(),
  addObstaclesToMap: jest.fn(),
  addWaypointsToMap: jest.fn(),
}));

jest.mock("../src/utils/Dijkstra/dijkstra.js", () => ({
  findShortestPath: jest.fn(),
}));

const mockMapData = {
  dimensions: { width: 10, height: 10 },
  obstacles: [
    { x: 2, y: 3 },
    { x: 4, y: 5 },
  ],
  waypoints: [
    { x: 1, y: 1, name: "A" },
    { x: 9, y: 9, name: "B" },
  ],
  routes: [
    {
      start: { x: 0, y: 0 },
      end: { x: 10, y: 10 },
      distance: 0,
    },
  ],
};

describe("calculatePath", () => {
  beforeEach(() => {
    createMap.mockClear();
    addObstaclesToMap.mockClear();
    addWaypointsToMap.mockClear();
    findShortestPath.mockClear();
  });

  it("should calculate the correct paths", () => {
    createMap.mockReturnValue({});
    findShortestPath
      .mockReturnValueOnce([
        [0, 0],
        [1, 1],
      ])
      .mockReturnValueOnce([
        [1, 1],
        [9, 9],
      ])
      .mockReturnValueOnce([
        [9, 9],
        [10, 10],
      ]);

    const result = calculatePath(mockMapData);

    expect(createMap).toHaveBeenCalledWith(10, 10);
    expect(addObstaclesToMap).toHaveBeenCalledWith({}, mockMapData.obstacles);
    expect(addWaypointsToMap).toHaveBeenCalledWith({}, mockMapData.waypoints);

    expect(findShortestPath).toHaveBeenCalledTimes(3);
    expect(findShortestPath).toHaveBeenNthCalledWith(1, {}, [0, 0], [1, 1]);
    expect(findShortestPath).toHaveBeenNthCalledWith(2, {}, [1, 1], [9, 9]);
    expect(findShortestPath).toHaveBeenNthCalledWith(3, {}, [9, 9], [10, 10]);

    expect(result).toEqual([
      [
        [0, 0],
        [1, 1],
        [9, 9],
        [10, 10],
      ],
    ]);
  });
});
