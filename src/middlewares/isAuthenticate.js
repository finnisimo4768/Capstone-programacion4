import passport from "passport";
import { ErrorFactory } from "../utils/index.js";

const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(
        ErrorFactory.createError(
          "AuthenticationError",
          "Authentication failed",
          401,
        ),
      );
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default isAuthenticated;
