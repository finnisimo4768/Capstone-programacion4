export const findShortestPath = (map, start, end, visitedWaypoints = []) => {
  const height = map.length;
  const width = map[0].length;

  const getNeighbors = (x, y) => {
    const neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < width - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < height - 1) neighbors.push([x, y + 1]);
    return neighbors;
  };

  const dist = Array.from({ length: height }, () =>
    Array(width).fill(Infinity),
  );
  const prev = Array.from({ length: height }, () => Array(width).fill(null));
  const queue = [[start[0], start[1]]];
  dist[start[1]][start[0]] = 0;

  while (queue.length > 0) {
    const [currentX, currentY] = queue.shift();
    const currentDist = dist[currentY][currentX];

    if (currentX === end[0] && currentY === end[1]) {
      const path = [];
      let [x, y] = end;
      while (prev[y][x]) {
        path.push([x, y]);
        [x, y] = prev[y][x];
      }
      path.push([x, y]);
      return path.reverse();
    }

    getNeighbors(currentX, currentY).forEach(([nx, ny]) => {
      if (map[ny][nx] !== -1 && dist[ny][nx] === Infinity) {
        dist[ny][nx] = currentDist + 1;
        prev[ny][nx] = [currentX, currentY];
        queue.push([nx, ny]);
      }
    });
  }

  return [];
};
