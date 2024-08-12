import { PrismaClient } from "@prisma/client";
import { formats } from "../utils/index.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorFactory, validateRouteCoordinates } from "../utils/index.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const getRouteById = async (id) => {
  logger.info(`Fetching route with ID: ${id}`);
  const route = await prisma.route.findUnique({
    where: { id_route: id },
  });

  if (!route) {
    logger.warn(`Route with ID: ${id} not found`);
    throw ErrorFactory.createError("NotFoundError", "Route not found", 404);
  }

  logger.info(`Route with ID: ${id} fetched successfully`);
  return formats.formattedRoute(route);
};

const createRoute = async (data) => {
  const { map_id, start, end, distance } = data;
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;

  if (validateRouteCoordinates(startX, startY, endX, endY)) {
    logger.warn(
      `Invalid route coordinates: (${startX}, ${startY}) to (${endX}, ${endY})`,
    );
    throw ErrorFactory.createError(
      "ValidationError",
      "The start and end coordinates are the same",
      400,
    );
  }

  logger.info(
    `Creating route with map ID: ${map_id}, start: (${startX}, ${startY}), end: (${endX}, ${endY}), distance: ${distance}`,
  );

  try {
    const route = await prisma.route.create({
      data: {
        map_id,
        startx: startX,
        starty: startY,
        endx: endX,
        endy: endY,
        distance: distance,
      },
    });

    logger.info(`Route with ID: ${route.id_route} created successfully`);
    return formats.formattedRoute(route);
  } catch (error) {
    logger.error(`Error creating route: ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
      }
    }
  }
};

const deleteRouteById = async (id) => {
  logger.info(`Deleting route with ID: ${id}`);

  try {
    await prisma.route.delete({
      where: { id_route: id },
    });
    logger.info(`Route with ID: ${id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting route with ID: ${id} - ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "Route not found", 404);
      }
    }
  }
};

const updateRouteDistance = async (id, data) => {
  const { distance } = data;

  logger.info(`Updating distance for route with ID: ${id} to ${distance}`);

  try {
    const route = await prisma.route.update({
      where: { id_route: id },
      data: { distance },
    });
    logger.info(`Distance for route with ID: ${id} updated successfully`);
    return formats.formattedRoute(route);
  } catch (error) {
    logger.error(
      `Error updating distance for route with ID: ${id} - ${error.message}`,
    );
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "Route not found", 404);
      }
    }
  }
};

const routeService = {
  getRouteById,
  createRoute,
  deleteRouteById,
  updateRouteDistance,
};

export default routeService;
