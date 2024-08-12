import { obstacleService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const getObstacleById = async (request, response) => {
  const { id } = request.params;

  const obstacle = await obstacleService.getObstacleById(id);

  reply(response, 200, obstacle);
};

const createObstacle = async (request, response) => {
  const { map_id, position } = request.body;
  const createdObstacle = { map_id, position };

  const obstacle = await obstacleService.createObstacle(createdObstacle);

  reply(response, 201, obstacle);
};

const deleteObstacleById = async (request, response) => {
  const { id } = request.params;

  await obstacleService.deleteObstacleById(id);

  reply(response, 204);
};

const updateObstaclePositions = async (request, response) => {
  const { id } = request.params;
  const position = request.body;

  await obstacleService.updateObstaclePositions(id, position);

  reply(response, 200);
};

const obstacleController = {
  getObstacleById: catchedAsync(getObstacleById),
  createObstacle: catchedAsync(createObstacle),
  deleteObstacleById: catchedAsync(deleteObstacleById),
  updateObstaclePositions: catchedAsync(updateObstaclePositions),
};

export default obstacleController;
