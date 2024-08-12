import { warnEnvConflicts } from "@prisma/client/runtime/library";
import dotenv from "dotenv";

dotenv.config();

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT = process.env.jwt;
const ID_USER = process.env.id_user;
const ID_MAP = process.env.id_map;

export { SECRET_JWT_KEY, SALT_ROUNDS, SESSION_SECRET, JWT, ID_USER, ID_MAP };
