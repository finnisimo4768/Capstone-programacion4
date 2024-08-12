import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { formats } from "../utils/index.js";
import { ErrorFactory } from "../utils/index.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const getObstacleById = async (id_obstacle) => {
  logger.info(`Fetching obstacle with ID: ${id_obstacle}`);
  const obstacle = await prisma.obstacle.findUnique({
    where: { id_obstacle: id_obstacle },
  });

  if (!obstacle) {
    logger.warn(`Obstacle with ID: ${id_obstacle} not found`);
    throw ErrorFactory.createError("NotFoundError", "Obstacle not found", 404);
  }

  logger.info(`Obstacle with ID: ${id_obstacle} found`);
  return formats.formattedObstacle(obstacle);
};

const createObstacle = async (data) => {
  const { map_id, position } = data;
  const { x, y } = position;

  logger.info(
    `Creating obstacle at position (${x}, ${y}) on map with ID: ${map_id}`,
  );

  try {
    const obstacle = await prisma.obstacle.create({
      data: {
        map_id,
        x,
        y,
      },
    });

    logger.info(`Obstacle created with ID: ${obstacle.id_obstacle}`);
    return formats.formattedObstacle(obstacle);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Map with ID: ${map_id} not found`);
        throw ErrorFactory.createError("NotFoundError", "Map not found", 404);
      }
    }
    logger.error(`Error creating obstacle: ${error.message}`);
    throw error;
  }
};

const deleteObstacleById = async (id) => {
  logger.info(`Deleting obstacle with ID: ${id}`);

  try {
    await prisma.obstacle.delete({
      where: { id_obstacle: id },
    });
    logger.info(`Obstacle with ID: ${id} deleted successfully`);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Obstacle with ID: ${id} not found`);
        throw ErrorFactory.createError(
          "NotFoundError",
          "Obstacle not found",
          404,
        );
      }
    }
    logger.error(`Error deleting obstacle with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const updateObstaclePositions = async (id, data) => {
  const { position } = data;
  const { x, y } = position;

  logger.info(`Updating obstacle with ID: ${id} to position (${x}, ${y})`);

  try {
    const obstacle = await prisma.obstacle.update({
      where: { id_obstacle: id },
      data: { x, y },
    });

    logger.info(`Obstacle with ID: ${id} updated successfully`);
    return formats.formattedObstacle(obstacle);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        logger.error(`Obstacle with ID: ${id} not found`);
        throw ErrorFactory.createError(
          "NotFoundError",
          "Obstacle not found",
          404,
        );
      }
    }
    logger.error(`Error updating obstacle with ID: ${id} - ${error.message}`);
    throw error;
  }
};

const obstacleService = {
  getObstacleById,
  createObstacle,
  deleteObstacleById,
  updateObstaclePositions,
};

export default obstacleService;
