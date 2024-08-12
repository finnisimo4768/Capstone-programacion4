import { check, param } from "express-validator";
import { validationFunctor } from "../utils/index.js";

const validateGetUser = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateCreateUser = validationFunctor([
  check("username").exists().trim().notEmpty(),
  check("password").exists().trim().notEmpty(),
  check("email").exists().trim().notEmpty().isEmail(),
]).get();

const validateDeleteUser = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
]).get();

const validateUpdateUserEmail = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("email").exists().trim().notEmpty().isEmail(),
]).get();

const validateUpdateUserPassword = validationFunctor([
  param("id").exists().notEmpty().isUUID(),
  check("password").exists().trim().notEmpty(),
]).get();

const validateUser = {
  validateGetUser,
  validateCreateUser,
  validateDeleteUser,
  validateUpdateUserEmail,
  validateUpdateUserPassword,
};

export default validateUser;
