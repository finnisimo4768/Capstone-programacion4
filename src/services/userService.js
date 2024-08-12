import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";
import { ErrorFactory } from "../utils/index.js";
import { logger } from "../config/logger_manager.js";

const prisma = new PrismaClient();

const getUserById = async (id) => {
  logger.info(`Fetching user with ID: ${id}`);
  const user = await prisma.user.findUnique({
    where: { id_user: id },
  });

  if (!user) {
    logger.warn(`User with ID: ${id} not found`);
    throw ErrorFactory.createError("NotFoundError", "User not found", 404);
  }

  logger.info(`User with ID: ${id} fetched successfully`);
  return user;
};

const createUser = async (data) => {
  const { username, password, email } = data;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  logger.info(`Creating user with username: ${username} and email: ${email}`);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });
    logger.info(`User with ID: ${user.id_user} created successfully`);
    return user;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw ErrorFactory.createError(
          "ValidationError",
          "Username or email already exists",
          422,
        );
      }
    }
  }
};

const deleteUserById = async (id) => {
  logger.info(`Deleting user with ID: ${id}`);

  try {
    await prisma.$transaction([
      prisma.map.deleteMany({
        where: {
          user_id: id,
        },
      }),
      prisma.user.delete({
        where: {
          id_user: id,
        },
      }),
    ]);
    logger.info(`User with ID: ${id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting user with ID: ${id} - ${error.message}`);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "User not found", 404);
      }
    }
  }
};

const updateUserEmail = async (id, email) => {
  logger.info(`Updating email for user with ID: ${id}`);

  try {
    await prisma.user.update({
      where: { id_user: id },
      data: { email },
    });
    logger.info(`Email for user with ID: ${id} updated successfully`);
  } catch (error) {
    logger.error(
      `Error updating email for user with ID: ${id} - ${error.message}`,
    ); // Log error
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "User not found", 404);
      }
      if (error.code === "P2002") {
        throw ErrorFactory.createError(
          "ValidationError",
          "Email already in use",
          422,
        );
      }
    }
  }
};

const updateUserPassword = async (id, password) => {
  logger.info(`Updating password for user with ID: ${id}`);
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await prisma.user.update({
      where: { id_user: id },
      data: { password: hashedPassword },
    });
    logger.info(`Password for user with ID: ${id} updated successfully`);
  } catch (error) {
    logger.error(
      `Error updating password for user with ID: ${id} - ${error.message}`,
    );
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw ErrorFactory.createError("NotFoundError", "User not found", 404);
      }
    }
  }
};

const userService = {
  getUserById,
  createUser,
  deleteUserById,
  updateUserEmail,
  updateUserPassword,
};

export default userService;
