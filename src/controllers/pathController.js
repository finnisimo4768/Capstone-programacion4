import { pathService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const createOptimalPath = async (request, response) => {
  try {
    const { id_map } = request.body;

    console.log("Received id_map:", id_map);

    const path = await pathService.createOptimalPath(id_map);

    console.log("Generated path:", path);

    reply(response, 201, { optimal_path: path });
  } catch (error) {
    console.error("Error in createOptimalPath controller:", error);
  }
};

const validateMapById = async (request, response) => {
  const { start_point, destination_point, map_id } = request.body;
  const validaters = { start_point, destination_point, map_id };

  const textResponse = await pathService.validateMapById(validaters);

  reply(response, 200, { message: textResponse });
};

const validateMapComponents = async (request, response) => {
  const { id_map } = request.body;

  const textResponse = await pathService.validateMapComponents({ id_map });

  reply(response, 200, { message: textResponse });
};

const validatePath = (request, response) => {
  const { optimal_path, map_data } = request.body;

  const textResponse = pathService.validatePath(optimal_path, map_data);

  reply(response, 200, { message: textResponse });
};

const validatePathWaypointsUser = (request, response) => {
  const { optimal_path, stopping_points } = request.body;

  const textResponse = pathService.validatePathWaypointsUser(
    optimal_path,
    stopping_points,
  );

  reply(response, 200, { message: textResponse });
};

const getPathById = async (request, response) => {
  const { id } = request.params;

  const path = pathService.getPathById(id);

  response.status(200).json(path);
};

const deletePathById = async (request, response) => {
  const { id } = request.params;

  await pathService.deletePathById(id);

  reply(response, 204);
};

const updatePathById = async (request, response) => {
  const { id } = request.params;
  const { path } = request.body;

  await pathService.updatePathById(id, path);

  reply(response, 200);
};

const pathController = {
  createOptimalPath: catchedAsync(createOptimalPath),
  validateMapById: catchedAsync(validateMapById),
  validateMapComponents: catchedAsync(validateMapComponents),
  validatePath: catchedAsync(validatePath),
  validatePathWaypointsUser: catchedAsync(validatePathWaypointsUser),
  getPathById: catchedAsync(getPathById),
  deletePathById: catchedAsync(deletePathById),
  updatePathById: catchedAsync(updatePathById),
};

export default pathController;
