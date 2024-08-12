import { PrismaClient } from "@prisma/client";
import { calculatePath } from "../utils/Dijkstra/pathFinder.js";
import { formats } from "../utils/formatters.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const createOptimalPath = async (id) => {
  logger.info(`Fetching map with ID: ${id}`);
  const map = await prisma.map.findUnique({
    where: { id_map: id },
    include: {
      obstacles: true,
      waypoints: true,
      routes: true,
    },
  });

  if (!map) {
    logger.warn(`Map with ID: ${id} not found`);
    return [];
  }

  logger.info(`Calculating optimal path for map with ID: ${id}`);
  const result = calculatePath(formats.formattedPath(map));

  if (result.length === 0 || result.every((path) => path.length === 0)) {
    logger.info(`No optimal path found for map with ID: ${id}`);
  } else {
    logger.info(`Optimal path calculated for map with ID: ${id}`);
  }

  return result;
};

const getPathById = async (id) => {
  logger.info(`Querying path with ID: ${id}`);
  const path = await prisma.path.findUnique({
    where: { id_path: id },
  });
  logger.info(`Path query result: ${path}`);
  return path;
};

const deletePathById = async (id) => {
  logger.info(`Deleting path with ID: ${id}`);
  try {
    await prisma.path.delete({
      where: { id_path: id },
    });
    logger.info(`Path with ID: ${id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting path with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const updatePathById = async (id, path) => {
  logger.info(`Updating path with ID: ${id}`);
  try {
    await prisma.path.update({
      where: { id_path: id },
      data: { path },
    });
    logger.info(`Path with ID: ${id} updated successfully`);
  } catch (error) {
    logger.error(`Error updating path with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const validateMapById = async (data) => {
  const { start_point, destination_point, map_id } = data;
  logger.info(
    `Validating map with ID: ${map_id}, start point: (${start_point.x}, ${start_point.y}), destination point: (${destination_point.x}, ${destination_point.y})`,
  );

  const route = await prisma.route.findFirst({
    where: {
      map_id,
      startx: start_point.x,
      starty: start_point.y,
      endx: destination_point.x,
      endy: destination_point.y,
    },
  });

  const result = route
    ? "The points and map are valid and exist in the database."
    : "The points and map are invalid and do not exist in the database.";

  logger.info(`Map validation result: ${result}`);
  return result;
};

const validateMapComponents = async (data) => {
  const { id_map } = data;
  logger.info(`Validating map components for map with ID: ${id_map}`);

  const map = await prisma.map.findUnique({
    where: { id_map },
    include: {
      obstacles: true,
      waypoints: true,
      routes: true,
    },
  });

  const formattedMap = formats.formattedPath(map);

  const result =
    formattedMap.obstacles.length > 0 &&
    formattedMap.waypoints.length > 0 &&
    formattedMap.routes.length > 0
      ? "The map has been correctly set up with obstacles, stopovers and routes."
      : "The map has not been configured correctly with obstacles, stopovers and routes.";

  logger.info(`Map components validation result: ${result}`);
  return result;
};

const validatePath = (path, map) => {
  const { obstacles, waypoints, routes } = map;

  const obstacleSet = new Set(obstacles.map((o) => `${o.x},${o.y}`));

  for (const [x, y] of path) {
    if (obstacleSet.has(`${x},${y}`)) {
      logger.warn(`Path contains obstacle at (${x}, ${y})`);
      return "Path is not valid";
    }
  }

  for (const waypoint of waypoints) {
    if (!path.some(([x, y]) => x === waypoint.x && y === waypoint.y)) {
      logger.warn(
        `Path does not include waypoint at (${waypoint.x}, ${waypoint.y})`,
      );
      return "Path is not valid";
    }
  }

  const start = path[0];
  const end = path[path.length - 1];
  const validStart = routes.some(
    (route) => route.start.x === start[0] && route.start.y === start[1],
  );
  const validEnd = routes.some(
    (route) => route.end.x === end[0] && route.end.y === end[1],
  );

  if (!validStart || !validEnd) {
    logger.warn(
      `Path start (${start[0]}, ${start[1]}) or end (${end[0]}, ${end[1]}) is not valid`,
    );
    return "Path is not valid";
  }

  logger.info(
    "Path is valid, avoiding obstacles and passing through stopping points",
  );
  return "The map route was successfully completed, avoiding obstacles and passing through the stopping points.";
};

const validatePathWaypointsUser = (path, waypoints) => {
  for (const waypoint of waypoints) {
    if (!path.some(([x, y]) => x === waypoint.x && y === waypoint.y)) {
      logger.warn(
        `Path does not include user-defined waypoint at (${waypoint.x}, ${waypoint.y})`,
      );
      return "Path is not valid";
    }
  }

  logger.info("Path complies with all stopping point restrictions");
  return "The calculated route complies with all stopping point restrictions.";
};

const pathService = {
  createOptimalPath,
  validateMapById,
  validateMapComponents,
  validatePath,
  validatePathWaypointsUser,
  getPathById,
  deletePathById,
  updatePathById,
};

export default pathService;
