import React, { useContext, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { FieldContext } from "../../../../utils/fieldContext";
import { animate } from "./../../../../utils/animate";

export default function GreenGun({ level, size, cellSize, coords }) {
  const rotateAnimatedValue = useRef(new Animated.Value(0)).current;
  const lazerAnimatedValue = useRef(new Animated.Value(0)).current;
  const selectionAnimatedValue = useRef(new Animated.Value(0)).current;

  const { entitiesRef, selectedGun } = useContext(FieldContext);

  const gunRef = useRef();

  const intervalRef = useRef();

  const distanceConstant = cellSize * 1.1 + cellSize;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      gunRef.current?.measure(async (fx, fy, width, height, px, py) => {
        const gunCoords = { x: px + width / 2, y: py + height / 2 };
        const x = gunCoords.x;
        const y = gunCoords.y;

        const entitiesData = (
          await Promise.all(
            Object.values(entitiesRef.current).map(
              (ref) =>
                new Promise(async (resolve) => {
                  if (ref.isDead()) resolve(null);
                  else {
                    const refCoords = await ref.getCurrentCoords();
                    resolve({ ref, refCoords });
                  }
                })
            )
          )
        ).filter((data) => data);

        const near = entitiesData.filter((data) => {
          const centerCoords = data.refCoords.center;
          const distance = Math.sqrt(
            Math.pow(x - centerCoords.x, 2) + Math.pow(y - centerCoords.y, 2)
          );
          return distance <= distanceConstant;
        });

        if (near.length) {
          const mappingFunc = ({ ref, refCoords: { corners } }) => {
            const cornersAngles = corners.map(({ x: refX, y: refY }) => {
              const coef = (refY - y) / (refX - x);
              return Math.atan(coef) + (refX < x ? Math.PI : 0);
            });
            const min = Math.min(...cornersAngles);
            const max = Math.max(...cornersAngles);

            return {
              start: min,
              end: max,
              ref,
              isEdgeCase: min < 0 && max > Math.PI,
            };
          };

          const availableIntervals = near.map(mappingFunc);
          const angleIntervals = entitiesData.map(mappingFunc);

          const mostValuableIntervalSet = availableIntervals
            .map((interval) =>
              angleIntervals.filter((angleInterval) => {
                if (interval.isEdgeCase && angleInterval.isEdgeCase)
                  return true;
                if (interval.isEdgeCase || angleInterval.isEdgeCase) {
                  const edge = interval.isEdgeCase ? interval : angleInterval;
                  const over = interval.isEdgeCase ? angleInterval : interval;
                  return over.start <= edge.start || over.end >= edge.end;
                }
                return (
                  angleInterval.end >= interval.start &&
                  angleInterval.start <= interval.end
                );
              })
            )
            .reduce((prev, cur) => (cur.length > prev.length ? cur : prev), []);

          const edgeValues = mostValuableIntervalSet.flatMap((interval) => [
            interval.start,
            interval.end,
          ]);

          let maxInterval = [];
          let resultRefs = [];
          let maxCount = 0;

          for (let edgeValue of edgeValues) {
            let curCount = 0;
            let refs = [];

            for (let interval of mostValuableIntervalSet) {
              if (
                (interval.isEdgeCase &&
                  (edgeValue <= interval.start || edgeValue >= interval.end)) ||
                (!interval.isEdgeCase &&
                  edgeValue >= interval.start &&
                  edgeValue <= interval.end)
              ) {
                curCount++;
                refs.push(interval.ref);
              }
            }
            if (curCount > maxCount) {
              maxInterval = [edgeValue];
              maxCount = curCount;
              resultRefs = refs;
            } else if (curCount === maxCount && maxInterval.length === 1) {
              maxInterval.push(edgeValue);
            }
          }

          const isEdgeCase =
            Math.min(...maxInterval) < 0 && Math.max(...maxInterval) > Math.PI;

          const angle =
            maxInterval.reduce(
              (prev, cur) =>
                cur < 0 && isEdgeCase ? Math.PI * 2 + cur + prev : cur + prev,
              0
            ) / 2;
          rotateAnimatedValue.setValue(angle);
          animate(lazerAnimatedValue, { toValue: 1, duration: 300 }, () =>
            lazerAnimatedValue.setValue(0)
          );
          resultRefs.forEach((ref) => ref.damage(40 * level));
        }
      });
    }, 1000);

    return function cleanup() {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (coords.toString() === selectedGun.toString())
      animate(selectionAnimatedValue, { toValue: 1, duration: 500 });
    else {
      animate(selectionAnimatedValue, { toValue: 0, duration: 500 });
    }
  }, [selectedGun]);

  const renderLazer = () => {
    return (
      <View
        style={{
          borderWidth: size * 0.04,
          borderColor: "#6DF826",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          borderBottomLeftRadius: "100%",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "lightgreen",
            width: 2000,
            height: 0.5,
            opacity: lazerAnimatedValue.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, 0.5, 1, 0.5, 1],
            }),
          }}
        ></Animated.View>
      </View>
    );
  };

  const renderDecorLines = () =>
    level === 4 && (
      <View
        style={{
          backgroundColor: "#6DF826",
          width: size * 0.8,
          height: size * 0.04,
        }}
      ></View>
    );

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        ref={gunRef}
        style={{
          width: size,
          aspectRatio: 1,
          borderRadius: "100%",
          borderColor: "#6DF826",
          borderWidth: size * 0.05,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: [
            {
              rotate: rotateAnimatedValue.interpolate({
                inputRange: [0, Math.PI * 2],
                outputRange: ["0rad", `${Math.PI * 2}rad`],
              }),
            },
          ],
          gap: size * 0.1,
        }}
      >
        {renderDecorLines()}
        <View
          style={{
            width: size,
            gap: -size * 0.05,
            right: -size * 0.2,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            height: level < 2 ? size * 0.2 : size * 0.35,
          }}
        >
          {renderLazer()}
          {level > 1 && renderLazer()}
          {level > 2 && renderLazer()}
        </View>
        {renderDecorLines()}
      </Animated.View>
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          aspectRatio: 1,
          width: distanceConstant * 2,
          backgroundColor: "white",
          borderRadius: 1000,
          opacity: 0.15,
          transform: [{ scale: selectionAnimatedValue }],
        }}
      ></Animated.View>
    </View>
  );
}