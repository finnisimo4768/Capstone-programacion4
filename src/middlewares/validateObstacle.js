import { check, param } from "express-validator";
import { validationFunctor } from "../utils/index.js";

const validateGetObstacle = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateCreateObstacle = validationFunctor([
  check("map_id").exists().notEmpty().isUUID(),
  check("position.x").exists().isNumeric().isInt(),
  check("position.y").exists().isNumeric().isInt(),
]).get();

const validateDeleteObstacle = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateUpdateObstaclePosition = validationFunctor([
  param("id").exists().isUUID(),
  check("position.x").exists().isNumeric().isInt(),
  check("position.y").exists().isNumeric().isInt(),
]).get();

const validateObstacle = {
  validateGetObstacle,
  validateCreateObstacle,
  validateDeleteObstacle,
  validateUpdateObstaclePosition,
};

export default validateObstacle;
