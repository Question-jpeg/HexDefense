export const rowColDoubler = (row, col) => {
  return [row * 2 + (col % 2), col];
};

export const rowColReverter = (row, col) => {
  return [(row - (col % 2)) / 2, col];
};
