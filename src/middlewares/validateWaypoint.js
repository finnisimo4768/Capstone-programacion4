import { check, param } from "express-validator";
import { validationFunctor } from "../utils/index.js";

const validateGetWaypoint = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateCreateWaypoint = validationFunctor([
  check("map_id").exists().notEmpty().isUUID(),
  check("position.x").exists().isNumeric().isInt(),
  check("position.y").exists().isNumeric().isInt(),
  check("name").exists().notEmpty(),
]).get();

const validateDeleteWaypoint = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateUpdateWaypointPosition = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("position.x").exists().isNumeric().isInt(),
  check("position.y").exists().isNumeric().isInt(),
]).get();

const validateWaypoint = {
  validateGetWaypoint,
  validateCreateWaypoint,
  validateDeleteWaypoint,
  validateUpdateWaypointPosition,
};

export default validateWaypoint;
