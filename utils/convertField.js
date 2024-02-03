import { Node } from "../game_logic/pathfinding/Node";
import { rowColDoubler } from "./rowColDoubler";

export const getConvertedField = (field) => {
  const mappedField = field.map((row) => Array(row.length));

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const [row, col] = rowColDoubler(i, j);
      mappedField[i][j] = new Node(col, row, field[i][j]);
    }
  }
  return mappedField;
};
