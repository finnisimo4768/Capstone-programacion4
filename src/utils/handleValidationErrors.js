import { validationResult } from "express-validator";
import { ErrorFactory } from "./index.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      ErrorFactory.createError("ValidationError", "Validation failed", 400),
    );
  }

  next();
};

export default handleValidationErrors;
