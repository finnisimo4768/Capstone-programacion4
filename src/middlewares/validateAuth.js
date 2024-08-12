import { check } from "express-validator";
import { validationFunctor } from "../utils/index.js";

const validateLogin = validationFunctor([
  check("username").exists().trim().notEmpty(),
  check("password").exists().trim().notEmpty(),
]).get();

const validateAuth = {
  validateLogin,
};

export default validateAuth;
