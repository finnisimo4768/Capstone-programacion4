import { routeService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const getRouteById = async (request, response) => {
  const { id } = request.params;

  const route = await routeService.getRouteById(id);

  reply(response, 200, route);
};

const createRoute = async (request, response) => {
  const { map_id, start, end, distance } = request.body;
  const createdRoute = { map_id, start, end, distance };

  const route = await routeService.createRoute(createdRoute);

  reply(response, 201, route);
};

const deleteRouteById = async (request, response) => {
  const { id } = request.params;

  await routeService.deleteRouteById(id);

  reply(response, 204);
};

const updateRouteByIdDistance = async (request, response) => {
  const { id } = request.params;
  const { distance } = request.body;

  await routeService.updateRouteDistance(id, distance);

  reply(response, 200);
};

const routeController = {
  getRouteById: catchedAsync(getRouteById),
  createRoute: catchedAsync(createRoute),
  deleteRouteById: catchedAsync(deleteRouteById),
  updateRouteByIdDistance: catchedAsync(updateRouteByIdDistance),
};

export default routeController;
