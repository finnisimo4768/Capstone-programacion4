import passport from "passport";
import { ErrorFactory } from "../utils/index.js";

const authenticate = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
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

export default authenticate;
