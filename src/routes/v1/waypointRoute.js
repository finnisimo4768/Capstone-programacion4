import express from "express";
import { waypointController } from "../../controllers/index.js";
import { validateWaypoint } from "../../middlewares/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const waypointRoutes = express.Router();

waypointRoutes
  .get(
    "/:id",
    isAuthenticated,
    validateWaypoint.validateGetWaypoint,
    waypointController.getWaypointById,
  )
  .post(
    "/",
    isAuthenticated,
    validateWaypoint.validateCreateWaypoint,
    waypointController.createWaypoint,
  )
  .delete(
    "/:id",
    isAuthenticated,
    validateWaypoint.validateDeleteWaypoint,
    waypointController.deleteWaypointById,
  )
  .patch(
    "/:id",
    isAuthenticated,
    validateWaypoint.validateUpdateWaypointPosition,
    waypointController.updateWaypointPositions,
  );

export { waypointRoutes };
