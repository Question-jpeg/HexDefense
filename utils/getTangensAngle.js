export const getTangensAngle = ({ x, y }, target) => {
  const coef = (target.y - y) / (target.x - x);
  return Math.atan(coef) + (target.x < x ? Math.PI : 0);
};
