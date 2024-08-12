export const createMap = (width, height) =>
  Array.from({ length: height }, () => Array(width).fill(0));

export const addObstaclesToMap = (map, obstacles) => {
  obstacles.forEach(({ x, y }) => {
    if (map[y] && map[y][x] !== undefined) {
      map[y][x] = -1;
    }
  });
  return map;
};

// Añade puntos de interés (waypoints) al mapa
export const addWaypointsToMap = (map, waypoints) => {
  waypoints.forEach(({ x, y }) => {
    if (map[y] && map[y][x] !== undefined) {
      map[y][x] = 2;
    }
  });
  return map;
};
