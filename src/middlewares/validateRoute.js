import { check, param } from "express-validator";
import { validationFunctor } from "../utils/index.js";

const validateGetRoute = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateCreateRoute = validationFunctor([
  check("map_id").exists().isUUID(),
  check("start.x").exists().isNumeric().isInt(),
  check("start.y").exists().isNumeric().isInt(),
  check("end.x").exists().isNumeric().isInt(),
  check("end.y").exists().isNumeric().isInt(),
  check("distance").exists().isNumeric().isInt(),
]).get();

const validateDeleteRoute = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateUpdateRouteDistance = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("distance").exists().isNumeric().isInt(),
]).get();

const validateRoute = {
  validateGetRoute,
  validateCreateRoute,
  validateDeleteRoute,
  validateUpdateRouteDistance,
};

export default validateRoute;
