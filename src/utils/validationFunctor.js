import handleValidationErrors from "./handleValidationErrors.js";

export const validationFunctor = (validations) => ({
  map: (fn) => validationFunctor([...validations, fn]),
  get: () => [...validations, handleValidationErrors],
});
