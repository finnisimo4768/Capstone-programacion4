import express from "express";
import { userController } from "../../controllers/index.js";
import { validateUser } from "../../middlewares/index.js";
import isAuthenticated from "../../middlewares/isAuthenticate.js";

const userRoutes = express.Router();

userRoutes
  .get(
    "/:id",
    isAuthenticated,
    validateUser.validateGetUser,
    userController.getUserById,
  )
  .post("/", validateUser.validateCreateUser, userController.createUser)
  .delete(
    "/:id",
    isAuthenticated,
    validateUser.validateDeleteUser,
    userController.deleteUserById,
  )
  .patch(
    "/email/:id",
    isAuthenticated,
    validateUser.validateUpdateUserEmail,
    userController.updateUserEmail,
  )
  .patch(
    "/password/:id",
    isAuthenticated,
    validateUser.validateUpdateUserPassword,
    userController.updateUserPassword,
  );

export { userRoutes };
