import { userService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const getUserById = async (request, response) => {
  const { id } = request.params;

  const user = await userService.getUserById(id);

  reply(response, 200, user);
};

const createUser = async (request, response) => {
  const { username, password, email } = request.body;
  const createdUser = { username, password, email };

  const user = await userService.createUser(createdUser);

  reply(response, 201, user);
};

const deleteUserById = async (request, response) => {
  const { id } = request.params;

  await userService.deleteUserById(id);

  reply(response, 204);
};

const updateUserPassword = async (request, response) => {
  const { id } = request.params;
  const { password } = request.body;

  await userService.updateUserPassword(id, password);

  reply(response, 200);
};

const updateUserEmail = async (request, response) => {
  const { id } = request.params;
  const { email } = request.body;

  await userService.updateUserPassword(id, email);

  reply(response, 200);
};

const userController = {
  getUserById: catchedAsync(getUserById),
  createUser: catchedAsync(createUser),
  deleteUserById: catchedAsync(deleteUserById),
  updateUserPassword: catchedAsync(updateUserPassword),
  updateUserEmail: catchedAsync(updateUserEmail),
};

export default userController;
