export const getClosestEntity = (entities) => {
  return entities.reduce(
    (prev, cur) =>
      cur.ref.getRemainingSteps() < prev.ref.getRemainingSteps() ? cur : prev,
    { ref: { getRemainingSteps: () => 999 } }
  );
};
