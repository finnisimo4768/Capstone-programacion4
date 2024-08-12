import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { formats } from "../utils/index.js";
import {
  ErrorFactory,
  validateRouteCoordinatesObstacles,
  validateSizeMap,
} from "../utils/index.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const getMapById = async (id) => {
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
    throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
  }

  logger.info(`Map with ID: ${id} retrieved successfully`);
  return formats.formattedPath(map);
};

const getAllMapByIdUser = async (id) => {
  logger.info(`Fetching all maps for user with ID: ${id}`);
  const maps = await prisma.map.findMany({
    where: { user_id: id },
    include: {
      obstacles: true,
      waypoints: true,
      routes: true,
    },
  });

  if (maps.length === 0) {
    logger.warn(`No maps found for user with ID: ${id}`);
    throw ErrorFactory.createError("NotFoundError", "Maps not found", 404);
  }

  logger.info(`Maps for user with ID: ${id} retrieved successfully`);
  return formats.formattedMaps(maps);
};

const createMap = async (data) => {
  const { name, dimensions, obstacles = [], user_id } = data;
  const { width, height } = dimensions;

  if (!validateSizeMap(width, height)) {
    logger.warn(`Map creation failed: Invalid map size (${width}x${height})`);
    throw ErrorFactory.createError(
      "ValidationError",
      "The size of the map does not correspond to the limits",
      400,
    );
  }

  logger.info(
    `Creating map with name: ${name}, dimensions: (${width}x${height})`,
  );

  try {
    const map = await prisma.map.create({
      data: {
        name,
        width,
        height,
        user_id,
        obstacles: {
          create: obstacles.map((obstacle) => ({
            x: obstacle.x,
            y: obstacle.y,
          })),
        },
      },
      include: {
        obstacles: true,
      },
    });

    logger.info(`Map created with ID: ${map.id_map}`);
    return formats.formattedMap(map);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        logger.error(`Invalid user ID: ${user_id}`);
        throw ErrorFactory.createError(
          "ValidationError",
          "Invalid user ID provided",
          400,
        );
      }
    }
    logger.error(`Error creating map: ${error.message}`);
    throw error;
  }
};

const deleteMapById = async (id) => {
  logger.info(`Deleting map with ID: ${id}`);

  try {
    await prisma.$transaction([
      prisma.obstacle.deleteMany({
        where: {
          map_id: id,
        },
      }),
      prisma.waypoint.deleteMany({
        where: {
          map_id: id,
        },
      }),
      prisma.route.deleteMany({
        where: {
          map_id: id,
        },
      }),
      prisma.map.delete({
        where: { id_map: id },
      }),
    ]);

    logger.info(`Map with ID: ${id} deleted successfully`);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Map with ID: ${id} not found`);
        throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
      }
    }
    logger.error(`Error deleting map with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const updateMapDimensions = async (id, data) => {
  const { dimensions } = data;
  const { width, height } = dimensions;

  logger.info(`Updating map with ID: ${id} dimensions to (${width}x${height})`);

  try {
    await prisma.map.update({
      where: { id_map: id },
      data: { width, height },
    });

    logger.info(`Map with ID: ${id} dimensions updated successfully`);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Map with ID: ${id} not found`);
        throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
      }
    }
    logger.error(
      `Error updating map dimensions with ID: ${id} - ${error.message}`,
    );
    throw error;
  }
};

const updateMapName = async (id, name) => {
  logger.info(`Updating map with ID: ${id} name to ${name}`);

  try {
    await prisma.map.update({
      where: { id_map: id },
      data: { name: name },
    });

    logger.info(`Map with ID: ${id} name updated successfully`);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Map with ID: ${id} not found`);
        throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
      }
    }
    logger.error(`Error updating map name with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const validateRouteMap = async (id) => {
  logger.info(`Validating routes for map with ID: ${id}`);
  const map = await getMapById(id);

  validateRouteCoordinatesObstacles(map);

  logger.info(`Routes for map with ID: ${id} validated successfully`);
  return "All routes have at least one valid path between the start and end points.";
};

const mapService = {
  getMapById,
  createMap,
  deleteMapById,
  updateMapDimensions,
  updateMapName,
  getAllMapByIdUser,
  validateRouteMap,
};

export default mapService;
