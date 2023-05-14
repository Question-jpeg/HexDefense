export const getDistance = (coordsA, coordsB) => {
  const dcol = Math.abs(coordsA.col - coordsB.col);
  const drow = Math.abs(coordsA.row - coordsB.row);

  return dcol + Math.max(0, (drow - dcol) / 2);
};
