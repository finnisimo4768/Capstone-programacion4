import express from "express";
import { obstacleController } from "../../controllers/index.js";
import { validateObstacle } from "../../middlewares/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const obstacleRoutes = express.Router();

obstacleRoutes
  .get(
    "/:id",
    isAuthenticated,
    validateObstacle.validateGetObstacle,
    obstacleController.getObstacleById,
  )
  .post(
    "/",
    isAuthenticated,
    validateObstacle.validateCreateObstacle,
    obstacleController.createObstacle,
  )
  .delete(
    "/:id",
    isAuthenticated,
    validateObstacle.validateDeleteObstacle,
    obstacleController.deleteObstacleById,
  )
  .patch(
    "/:id",
    isAuthenticated,
    validateObstacle.validateUpdateObstaclePosition,
    obstacleController.updateObstaclePositions,
  );

export { obstacleRoutes };
