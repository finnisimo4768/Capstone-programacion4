import { check, param } from "express-validator";
import { ErrorFactory } from "../utils/index.js";
import { validationFunctor } from "../utils/index.js";

const validateGetMap = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateGetAllMaps = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateCreateMap = validationFunctor([
  check("name").exists().notEmpty(),
  check("user_id").exists().notEmpty().isUUID(),
  check("dimensions.width").exists().notEmpty().isNumeric().isInt(),
  check("dimensions.height").exists().notEmpty().isNumeric().isInt(),
  check("obstacles")
    .optional()
    .isArray()
    .bail()
    .custom((obstacles) => {
      obstacles.forEach((obstacle) => {
        if (typeof obstacle !== "object" || obstacle === null) {
          throw ErrorFactory.createError(
            "ValidationError",
            "Validation failed",
            400,
          );
        }
        if (!Number.isInteger(obstacle.x) || !Number.isInteger(obstacle.y)) {
          throw ErrorFactory.createError(
            "ValidationError",
            "Validation failed",
            400,
          );
        }
      });
      return true;
    }),
]).get();

const validateDeleteMap = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateUpdateMapDimensions = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("dimensions.width").exists().notEmpty().isNumeric().isInt(),
  check("dimensions.height").exists().notEmpty().isNumeric().isInt(),
]).get();

const validateUpdateMapName = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("name").exists().trim().notEmpty(),
]).get();

const validateMap = {
  validateGetMap,
  validateGetAllMaps,
  validateCreateMap,
  validateDeleteMap,
  validateUpdateMapDimensions,
  validateUpdateMapName,
};

export default validateMap;
