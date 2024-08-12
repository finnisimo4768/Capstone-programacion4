import express from "express";
import { authController } from "../../controllers/index.js";

const authRoutes = express.Router();

authRoutes.post("/login", authController.loginUser);

export { authRoutes };
