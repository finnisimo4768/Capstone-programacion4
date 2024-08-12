import { createMap, addObstaclesToMap, addWaypointsToMap } from "./map.js";
import { findShortestPath } from "./dijkstra.js";

export const calculatePath = (mapData) => {
  const { dimensions, obstacles, waypoints, routes } = mapData;
  const map = createMap(dimensions.width, dimensions.height);
  addObstaclesToMap(map, obstacles);
  addWaypointsToMap(map, waypoints);

  const completePaths = [];

  routes.forEach((route) => {
    const { start, end } = route;
    const waypointPaths = [];
    const visitedWaypoints = new Set();

    let currentStart = [start.x, start.y];

    waypoints.forEach((waypoint) => {
      if (visitedWaypoints.has(`${waypoint.x},${waypoint.y}`)) return;

      const pathToWaypoint = findShortestPath(map, currentStart, [
        waypoint.x,
        waypoint.y,
      ]);

      if (pathToWaypoint.length === 0) return;

      pathToWaypoint.pop();
      waypointPaths.push(pathToWaypoint);
      currentStart = [waypoint.x, waypoint.y];
      visitedWaypoints.add(`${waypoint.x},${waypoint.y}`);
    });

    const pathToEnd = findShortestPath(map, currentStart, [end.x, end.y]);
    if (pathToEnd.length === 0) return;

    waypointPaths.push(pathToEnd);
    const completePath = waypointPaths.flat();
    completePaths.push(completePath);
  });

  return completePaths;
};
