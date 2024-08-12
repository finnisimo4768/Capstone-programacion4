import { waypointService } from "../services/index.js";
import { catchedAsync, reply } from "../utils/index.js";

const getWaypointById = async (request, response) => {
  const { id } = request.params;

  const waypoint = await waypointService.getWaypointById(id);

  reply(response, 200, waypoint);
};

const createWaypoint = async (request, response) => {
  const { map_id, position, name } = request.body;
  const createdWaypoint = { map_id, position, name };

  const waypoint = await waypointService.createWaypoint(createdWaypoint);

  reply(response, 201, waypoint);
};

const deleteWaypointById = async (request, response) => {
  const { id } = request.params;

  await waypointService.deleteWaypointById(id);

  reply(response, 204);
};

const updateWaypointPositions = async (request, response) => {
  const { id } = request.params;
  const { position } = request.body;

  await waypointService.updateWaypointPositions(id, position);

  reply(response, 200);
};

const waypointController = {
  getWaypointById: catchedAsync(getWaypointById),
  createWaypoint: catchedAsync(createWaypoint),
  deleteWaypointById: catchedAsync(deleteWaypointById),
  updateWaypointPositions: catchedAsync(updateWaypointPositions),
};

export default waypointController;
