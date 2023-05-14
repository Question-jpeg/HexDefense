useEffect(() => {
  if (instruction) {
    const setData = (path) => {
      const steps = path.length - 1;
      if (steps !== 0)
        setMoveData({
          path,
          steps,
          stepsMap: Array.from(Array(steps + 1).keys()),
          moveMap: path.map((coords) => [
            coords[0] * size * 0.92 - offset[0],
            coords[1] * size * 0.535 - offset[1],
          ]),
        });
    };

    const appendPath = (currentStep, path) => {
      setMoveData((data) => {
        const newPath = [...data.path.slice(0, currentStep), ...path];
        const steps = newPath.length - 1;
        return {
          path: newPath,
          steps,
          stepsMap: Array.from(Array(steps + 1).keys()),
          moveMap: newPath.map((coords) => [
            coords[0] * size * 0.92 - offset[0],
            coords[1] * size * 0.535 - offset[1],
          ]),
        };
      });
    };

    if (!moveData) setData(instruction);
    else {
      const currentStep = Math.ceil(currentMoveAnimatedValue.current);
      const coordsStart = moveData.path[currentStep];
      appendPath(currentStep, getCoordinatedPath(field, coordsStart, [8, 20]));
    }
  }
}, [instruction]);

useEffect(() => {
  if (field) {
    const path = getCoordinatedPath(field, coords, [8, 20]);
    if (path !== null) setPath(path);
  }
}, [field]);
