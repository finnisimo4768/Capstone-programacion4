import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { SECRET_JWT_KEY } from "../config.js";
import { ErrorFactory } from "../utils/index.js";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { username: username },
        });

        if (!user) {
          return done(
            ErrorFactory.createError("NotFoundError", "User not found", 404),
            false,
          );
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(
            ErrorFactory.createError(
              "AuthenticationError",
              "Authentication failed",
              401,
            ),
            false,
          );
        }

        const access_token = jwt.sign(
          { id: user.id_user, username: user.username, email: user.email },
          SECRET_JWT_KEY,
          { expiresIn: "24h" },
        );

        return done(null, { id: user.id_user, access_token });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_JWT_KEY,
    },
    (jwtPayload, done) => {
      if (jwtPayload.id) {
        return done(null, { id: jwtPayload.id, name: jwtPayload.name });
      }
      return done(null, false);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id_user: id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
