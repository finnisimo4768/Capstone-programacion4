import { formats } from "../src/utils/formatters.js";

describe("Formatters", () => {
  test("formattedMap should format map correctly", () => {
    const input = {
      id_map: 1,
      name: "Test Map",
      width: 100,
      height: 200,
      obstacles: [{ x: 10, y: 20 }],
    };
    const expected = {
      id: 1,
      name: "Test Map",
      dimensions: { width: 100, height: 200 },
      obstacles: [{ x: 10, y: 20 }],
    };

    expect(formats.formattedMap(input)).toEqual(expected);
  });

  test("formattedPath should format map with path-related data correctly", () => {
    const input = {
      id_map: 1,
      name: "Test Map",
      width: 100,
      height: 200,
      obstacles: [{ x: 10, y: 20 }],
      waypoints: [{ x: 30, y: 40, name: "Waypoint 1" }],
      routes: [
        {
          startx: 10,
          starty: 20,
          endx: 30,
          endy: 40,
          distance: 15,
        },
      ],
    };
    const expected = {
      id: 1,
      name: "Test Map",
      dimensions: { width: 100, height: 200 },
      obstacles: [{ x: 10, y: 20 }],
      waypoints: [{ x: 30, y: 40, name: "Waypoint 1" }],
      routes: [
        {
          start: { x: 10, y: 20 },
          end: { x: 30, y: 40 },
          distance: 15,
        },
      ],
    };

    expect(formats.formattedPath(input)).toEqual(expected);
  });

  test("formattedMaps should format an array of maps correctly", () => {
    const input = [
      {
        id_map: 1,
        name: "Test Map 1",
        width: 100,
        height: 200,
        obstacles: [{ x: 10, y: 20 }],
        waypoints: [{ x: 30, y: 40, name: "Waypoint 1" }],
        routes: [
          {
            startx: 10,
            starty: 20,
            endx: 30,
            endy: 40,
            distance: 15,
          },
        ],
      },
    ];
    const expected = [
      {
        id: 1,
        name: "Test Map 1",
        dimensions: { width: 100, height: 200 },
        obstacles: [{ x: 10, y: 20 }],
        waypoints: [{ x: 30, y: 40, name: "Waypoint 1" }],
        routes: [
          {
            start: { x: 10, y: 20 },
            end: { x: 30, y: 40 },
            distance: 15,
          },
        ],
      },
    ];

    expect(formats.formattedMaps(input)).toEqual(expected);
  });

  test("formattedObstacle should format obstacle correctly", () => {
    const input = {
      id_obstacle: 1,
      map_id: 2,
      x: 10,
      y: 20,
    };
    const expected = {
      id: 1,
      id_map: 2,
      position: { x: 10, y: 20 },
    };

    expect(formats.formattedObstacle(input)).toEqual(expected);
  });

  test("formattedRoute should format route correctly", () => {
    const input = {
      id_route: 1,
      map_id: 2,
      startx: 10,
      starty: 20,
      endx: 30,
      endy: 40,
      distance: 15,
    };
    const expected = {
      id: 1,
      id_map: 2,
      start: { x: 10, y: 20 },
      end: { x: 30, y: 40 },
      distance: 15,
    };

    expect(formats.formattedRoute(input)).toEqual(expected);
  });

  test("formattedWaypoint should format waypoint correctly", () => {
    const input = {
      id_waypoint: 1,
      map_id: 2,
      x: 30,
      y: 40,
      name: "Waypoint 1",
    };
    const expected = {
      id: 1,
      id_map: 2,
      position: { x: 30, y: 40 },
      name: "Waypoint 1",
    };

    expect(formats.formattedWaypoint(input)).toEqual(expected);
  });
});
