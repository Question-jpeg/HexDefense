import { rowColReverter } from "../../utils/rowColDoubler";
import { isTypeWalkable } from "./../../utils/isTypeWalkable";

export class Node {
  Col;
  Row;
  Type;

  G = 0;
  H = 0;
  Connection;

  static createFromNode(node) {
    return new this(node.Col, node.Row, node.Type);
  }

  constructor(col, row, type) {
    this.Col = col;
    this.Row = row;
    this.Type = type;
  }

  get Walkable() {
    return isTypeWalkable(this.Type);
  }

  get F() {
    return this.G + this.H;
  }

  GetNeighbors(field) {
    const col = this.Col;
    const row = this.Row;

    const vectors = [
      [col, row - 2],
      [col + 1, row - 1],
      [col + 1, row + 1],
      [col, row + 2],
      [col - 1, row + 1],
      [col - 1, row - 1],
    ];

    return vectors
      .map((coords) => {
        const [i, j] = rowColReverter(coords[1], coords[0]);
        if (i >= 0 && i < field.length && j >= 0 && j < field[i].length)
          return field[i][j];

        return null;
      })
      .filter((node) => node !== null);
  }

  GetDistance(node) {
    const a = { row: node.Row, col: node.Col };
    const b = { row: this.Row, col: this.Col };

    const dcol = Math.abs(a.col - b.col);
    const drow = Math.abs(a.row - b.row);

    return dcol + Math.max(0, (drow - dcol) / 2);
  }
}
