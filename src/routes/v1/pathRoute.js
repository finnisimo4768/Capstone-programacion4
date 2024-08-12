import express from "express";
import { pathController } from "../../controllers/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const pathRoutes = express.Router();

pathRoutes
  .post("/", isAuthenticated, pathController.createOptimalPath)
  .post("/validate", isAuthenticated, pathController.validateMapById)
  .post(
    "/validate-components",
    isAuthenticated,
    pathController.validateMapComponents,
  )
  .post("/validate-path", isAuthenticated, pathController.validatePath)
  .post(
    "/validate-waypoints",
    isAuthenticated,
    pathController.validatePathWaypointsUser,
  )
  .get("/:id", isAuthenticated, pathController.getPathById)
  .delete("/:id", isAuthenticated, pathController.deletePathById)
  .put("/:id", isAuthenticated, pathController.updatePathById);

export { pathRoutes };
