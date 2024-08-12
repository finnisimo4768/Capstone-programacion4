import { catchedAsync } from "../utils/index.js";
import passport from "passport";
import { ErrorFactory } from "../utils/index.js";

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      ErrorFactory.createError(
        "AuthenticationError",
        "Authentication failed",
        401,
      );
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ access_token: user.access_token });
    });
  })(req, res, next);
};

const authController = {
  loginUser: catchedAsync(loginUser),
};

export default authController;
