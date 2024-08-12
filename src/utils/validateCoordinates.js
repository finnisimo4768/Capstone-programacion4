import ErrorFactory from "./errors.js";

export const validateCoordinates = (width, height, coordinates) => {
  return coordinates.every(
    ([x, y]) => x >= 0 && x < width && y >= 0 && y < height,
  );
};

export const validateRouteCoordinates = (startX, startY, endX, endY) =>
  startX === endX && startY === endY;

export const validateRouteCoordinatesObstacles = (map) => {
  const isWithinBounds = (x, y, width, height) => {
    return x >= 0 && x < width && y >= 0 && y < height;
  };

  const isCoordinateFree = (x, y) => {
    return !map.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y,
    );
  };

  const isPathFree = (start, end) => {
    const directions = [
      { x: 1, y: 0 }, // Derecha
      { x: -1, y: 0 }, // Izquierda
      { x: 0, y: 1 }, // Abajo
      { x: 0, y: -1 }, // Arriba
    ];

    const queue = [start];
    const visited = new Set();
    const startKey = `${start.x},${start.y}`;
    visited.add(startKey);

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.x === end.x && current.y === end.y) {
        return true;
      }

      for (const direction of directions) {
        const nextX = current.x + direction.x;
        const nextY = current.y + direction.y;
        const nextKey = `${nextX},${nextY}`;

        if (
          isWithinBounds(
            nextX,
            nextY,
            map.dimensions.width,
            map.dimensions.height,
          ) &&
          isCoordinateFree(nextX, nextY) &&
          !visited.has(nextKey)
        ) {
          visited.add(nextKey);
          queue.push({ x: nextX, y: nextY });
        }
      }
    }

    return false;
  };

  const validateRoutes = () => {
    for (const route of map.routes) {
      const { start, end } = route;

      if (!isPathFree(start, end)) {
        throw ErrorFactory.createError(
          "NotFoundError",
          "Route is obstructed by an obstacle",
          404,
        );
      }
    }
  };

  validateRoutes();
};
