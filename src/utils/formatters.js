const formattedMap = (map) => {
  return {
    id: map.id_map,
    name: map.name,
    dimensions: {
      width: map.width,
      height: map.height,
    },
    obstacles: map.obstacles.map((obstacle) => ({
      x: obstacle.x,
      y: obstacle.y,
    })),
  };
};

const formattedPath = (map) => ({
  id: map.id_map,
  name: map.name,
  dimensions: {
    width: map.width,
    height: map.height,
  },
  obstacles: map.obstacles.map((obstacle) => ({
    x: obstacle.x,
    y: obstacle.y,
  })),
  waypoints: map.waypoints.map((waypoint) => ({
    x: waypoint.x,
    y: waypoint.y,
    name: waypoint.name,
  })),
  routes: map.routes.map((route) => ({
    start: {
      x: route.startx,
      y: route.starty,
    },
    end: {
      x: route.endx,
      y: route.endy,
    },
    distance: route.distance,
  })),
});

const formattedMaps = (maps) => {
  return maps.map((map) => ({
    id: map.id_map,
    name: map.name,
    dimensions: {
      width: map.width,
      height: map.height,
    },
    obstacles: map.obstacles.map((obstacle) => ({
      x: obstacle.x,
      y: obstacle.y,
    })),
    waypoints: map.waypoints
      ? map.waypoints.map((waypoint) => ({
          x: waypoint.x,
          y: waypoint.y,
          name: waypoint.name,
        }))
      : [],
    routes: map.routes
      ? map.routes.map((route) => ({
          start: {
            x: route.startx,
            y: route.starty,
          },
          end: {
            x: route.endx,
            y: route.endy,
          },
          distance: route.distance,
        }))
      : [],
  }));
};

const formattedObstacle = (obstacle) => {
  return {
    id: obstacle.id_obstacle,
    id_map: obstacle.map_id,
    position: {
      x: obstacle.x,
      y: obstacle.y,
    },
  };
};

const formattedRoute = (route) => {
  return {
    id: route.id_route,
    id_map: route.map_id,
    start: {
      x: route.startx,
      y: route.starty,
    },
    end: {
      x: route.endx,
      y: route.endy,
    },
    distance: route.distance,
  };
};

const formattedWaypoint = (waypoint) => {
  return {
    id: waypoint.id_waypoint,
    id_map: waypoint.map_id,
    position: {
      x: waypoint.x,
      y: waypoint.y,
    },
    name: waypoint.name,
  };
};

const formats = {
  formattedMap,
  formattedMaps,
  formattedObstacle,
  formattedRoute,
  formattedWaypoint,
  formattedPath,
};

export { formats };
