import { mapService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const getMapById = async (request, response) => {
  const { id } = request.params;

  const map = await mapService.getMapById(id);

  reply(response, 200, map);
};

const getAllMapByIdUser = async (request, response) => {
  const { id } = request.params;

  const maps = await mapService.getAllMapByIdUser(id);

  reply(response, 200, maps);
};

const createMap = async (request, response) => {
  const { name, dimensions, obstacles = [], user_id } = request.body;
  const createdMap = { name, dimensions, obstacles, user_id };

  const map = await mapService.createMap(createdMap);

  reply(response, 200, map);
};

const deleteMapById = async (request, response) => {
  const { id } = request.params;

  await mapService.deleteMapById(id);

  reply(response, 204);
};

const updateMapDimensions = async (request, response) => {
  const { id } = request.params;
  const { dimensions } = request.body;

  await mapService.updateMapDimensions(id, dimensions);

  reply(response, 200);
};

const updateMapName = async (request, response) => {
  const { id } = request.params;
  const { name } = request.body;

  await mapService.updateMapName(id, name);

  reply(response, 200);
};

const validateRouteMap = async (request, response) => {
  const { id } = request.body;

  const responseText = await mapService.validateRouteMap(id);

  reply(response, 200, { message: responseText });
};

const mapController = {
  getMapById: catchedAsync(getMapById),
  createMap: catchedAsync(createMap),
  deleteMapById: catchedAsync(deleteMapById),
  updateMapDimensions: catchedAsync(updateMapDimensions),
  updateMapName: catchedAsync(updateMapName),
  getAllMapByIdUser: catchedAsync(getAllMapByIdUser),
  validateRouteMap: catchedAsync(validateRouteMap),
};

export default mapController;
