import express from "express";
import { routeController } from "../../controllers/index.js";
import { validateRoute } from "../../middlewares/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const routeRoutes = express.Router();

routeRoutes
  .get(
    "/:id",
    isAuthenticated,
    validateRoute.validateGetRoute,
    routeController.getRouteById,
  )
  .post(
    "/",
    isAuthenticated,
    validateRoute.validateCreateRoute,
    routeController.createRoute,
  )
  .delete(
    "/:id",
    isAuthenticated,
    validateRoute.validateDeleteRoute,
    routeController.deleteRouteById,
  )
  .patch(
    "/distance/:id",
    isAuthenticated,
    validateRoute.validateUpdateRouteDistance,
    routeController.updateRouteByIdDistance,
  );

export { routeRoutes };
