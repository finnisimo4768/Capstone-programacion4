import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorFactory } from "../utils/index.js";
import { formats } from "../utils/index.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const getWaypointById = async (id) => {
  logger.info(`Fetching waypoint with ID: ${id}`);
  const waypoint = await prisma.waypoint.findUnique({
    where: { id_waypoint: id },
  });

  if (!waypoint) {
    logger.warn(`Waypoint with ID: ${id} not found`);
    throw ErrorFactory.createError("NotFoundError", "Waypoint not found", 404);
  }

  logger.info(`Waypoint with ID: ${id} fetched successfully`);
  return formats.formattedWaypoint(waypoint);
};

const createWaypoint = async (data) => {
  const { map_id, position, name } = data;
  const { x, y } = position;

  logger.info(
    `Creating waypoint with map ID: ${map_id}, position: (${x}, ${y}), and name: ${name}`,
  );

  try {
    const waypoint = await prisma.waypoint.create({
      data: {
        map_id,
        x,
        y,
        name,
      },
    });
    logger.info(
      `Waypoint with ID: ${waypoint.id_waypoint} created successfully`,
    );
    return formats.formattedWaypoint(waypoint);
  } catch (error) {
    logger.error(`Error creating waypoint: ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw ErrorFactory.createError(
          "ValidationError",
          "Invalid map ID provided",
          422,
        );
      }
    }
  }
};

const deleteWaypointById = async (id) => {
  logger.info(`Deleting waypoint with ID: ${id}`);

  try {
    await prisma.waypoint.delete({
      where: { id_waypoint: id },
    });
    logger.info(`Waypoint with ID: ${id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting waypoint with ID: ${id} - ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError(
          "NotFoundError",
          "Waypoint not found",
          404,
        );
      }
    }
  }
};

const updateWaypointPositions = async (id, data) => {
  const { x, y } = data;

  logger.info(`Updating positions for waypoint with ID: ${id} to (${x}, ${y})`);

  try {
    const waypoint = await prisma.waypoint.update({
      where: { id_waypoint: id },
      data: { x, y },
    });
    logger.info(`Positions for waypoint with ID: ${id} updated successfully`);
    return formats.formattedWaypoint(waypoint);
  } catch (error) {
    logger.error(
      `Error updating positions for waypoint with ID: ${id} - ${error.message}`,
    );
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError(
          "NotFoundError",
          "Waypoint not found",
          404,
        );
      }
    }
  }
};

const waypointService = {
  getWaypointById,
  createWaypoint,
  deleteWaypointById,
  updateWaypointPositions,
};

export default waypointService;
