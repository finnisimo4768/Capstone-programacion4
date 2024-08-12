import express from "express";
import { mapController } from "../../controllers/index.js";
import { validateMap } from "../../middlewares/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const mapRoutes = express.Router();

mapRoutes
  .get(
    "/:id",
    isAuthenticated,
    validateMap.validateGetMap,
    mapController.getMapById,
  )
  .get(
    "/all/:id",
    isAuthenticated,
    validateMap.validateGetAllMaps,
    mapController.getAllMapByIdUser,
  )
  .post(
    "/",
    isAuthenticated,
    validateMap.validateCreateMap,
    mapController.createMap,
  )
  .delete(
    "/:id",
    isAuthenticated,
    validateMap.validateDeleteMap,
    mapController.deleteMapById,
  )
  .patch(
    "/dimensions/:id",
    isAuthenticated,
    validateMap.validateUpdateMapDimensions,
    mapController.updateMapDimensions,
  )
  .patch(
    "/name/:id",
    isAuthenticated,
    validateMap.validateUpdateMapName,
    mapController.updateMapName,
  )
  .post("/validate-route", isAuthenticated, mapController.validateRouteMap);

export { mapRoutes };
