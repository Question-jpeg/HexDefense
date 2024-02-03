export const getNearEntities = async (
  entities,
  distanceConstant,
  { x, y },
  { searchNear } = { searchNear: true }
) => {
  return (
    await Promise.all(
      entities.map(
        (ref) =>
          new Promise(async (resolve) => {
            if (ref.isDead()) resolve(null);
            else {
              const refCoords = await ref.getCurrentCoords();
              const centerCoords = refCoords.center;
              if (searchNear) {
                const distance = Math.sqrt(
                  Math.pow(x - centerCoords.x, 2) +
                    Math.pow(y - centerCoords.y, 2)
                );
                if (distance <= distanceConstant) resolve({ ref, refCoords });
                else resolve(null);
              } else {
                resolve({ ref, refCoords });
              }
            }
          })
      )
    )
  ).filter((data) => data);
};
