import { rowColReverter } from "../../utils/rowColDoubler";
import { Node } from "./Node";

const findPath = (field, startNode, targetNode) => {
  const toSearch = [startNode];
  const processed = [];

  while (toSearch.length) {
    let current = toSearch[0];
    for (let node of toSearch) {
      if (node.F < current.F || (node.F === current.F && node.H < current.H))
        current = node;
    }

    if (current === targetNode) {
      let currentPathTile = targetNode;
      const path = [];
      while (currentPathTile !== startNode) {
        path.push(currentPathTile);
        currentPathTile = currentPathTile.Connection;
      }
      path.push(currentPathTile);

      return path.reverse();
    }

    processed.push(current);
    toSearch.splice(toSearch.indexOf(current), 1);

    for (let neighbor of current
      .GetNeighbors(field)
      .filter((node) => node.Walkable && !processed.includes(node))) {
      const inSearch = toSearch.includes(neighbor);

      const costToNeighbor = current.G + 1;

      if (!inSearch || costToNeighbor < neighbor.G) {
        neighbor.G = costToNeighbor;
        neighbor.Connection = current;

        if (!inSearch) {
          neighbor.H = neighbor.GetDistance(targetNode);
          toSearch.push(neighbor);
        }
      }
    }
  }
  return null;
};

export const getCoordinatedPath = (field, coordsStart, coordsEnd) => {
  const newField = field.map((row) =>
    row.map((node) => Node.createFromNode(node))
  );

  const [startRow, startCol] = rowColReverter(coordsStart[1], coordsStart[0]);
  const [endRow, endCol] = rowColReverter(coordsEnd[1], coordsEnd[0]);
  const startNode = newField[startRow][startCol];
  const targetNode = newField[endRow][endCol];
  const path = findPath(newField, startNode, targetNode)?.map((node) => [
    node.Col,
    node.Row,
  ]);
  return path;
};
