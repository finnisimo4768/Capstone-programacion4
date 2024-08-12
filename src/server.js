import express from "express";
import morgan from "morgan";
import {
  userRoutes,
  authRoutes,
  mapRoutes,
  obstacleRoutes,
  waypointRoutes,
  routeRoutes,
  pathRoutes,
} from "./routes/v1/index.js";
import { resError } from "./utils/index.js";
import passport from "passport";
import "./config/passport.js";
import session from "express-session";
import { SESSION_SECRET } from "./config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/obstacles", obstacleRoutes);
app.use("/api/v1/waypoints", waypointRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/paths", pathRoutes);

app.use((error, request, response, next) => {
  if (error) {
    resError(
      response,
      error.statusCode || 500,
      error.message || "Internal Server Error",
    );
  } else {
    next();
  }
});

export { app };
