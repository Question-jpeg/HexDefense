import React, {
  useEffect,
  useImperativeHandle,
} from "react";
import { animate } from "../../../utils/animate";

export default function useGunLogic({
  ref,
  tickFunc,
  tickIntervalValue,
  intervalRef,
  gunRef,
  selectionAnimatedValue,
  funcExtension = { stopInterval: () => {} },
}) {

  useImperativeHandle(ref, () => ({
    select: () =>
      animate(selectionAnimatedValue, { toValue: 1, duration: 500 }),
    deselect: () =>
      animate(selectionAnimatedValue, { toValue: 0, duration: 500 }),
    activate: startInterval,
    deactivate: stopInterval,
  }));

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      gunRef.current?.measure(async (fx, fy, width, height, px, py) => {
        const gunCoords = { x: px + width / 2, y: py + height / 2 };
        const x = gunCoords.x;
        const y = gunCoords.y;

        tickFunc(gunCoords, x, y);
      });
    }, tickIntervalValue);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    funcExtension.stopInterval();
  };

  useEffect(() => {
    return function cleanup() {
      stopInterval();
    };
  }, []);
}
