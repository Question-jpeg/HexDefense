import React, { useContext, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import GunsInfo from "../../../../config/GunsInfo";
import { FieldContext } from "../../../../utils/fieldContext";
import { animate } from "./../../../../utils/animate";

export default function BlueGun({
  level,
  size,
  cellSize,
  isSelected,
  isActive,
}) {
  const selectionAnimatedValue = useRef(new Animated.Value(0)).current;
  const circleScaleAnimatedValue = useRef(new Animated.Value(0)).current;

  const { entitiesRef } = useContext(FieldContext);

  const gunRef = useRef();

  const intervalRef = useRef();
  const zoneIntervalRef = useRef();

  const distanceConstant = cellSize * (level < 3 ? 1 : 2) * 1.1 + cellSize / 2;

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      gunRef.current?.measure(async (fx, fy, width, height, px, py) => {
        const gunCoords = { x: px + width / 2, y: py + height / 2 };
        const x = gunCoords.x;
        const y = gunCoords.y;

        const near = (
          await Promise.all(
            Object.values(entitiesRef.current).map(
              (ref) =>
                new Promise(async (resolve) => {
                  if (ref.isDead()) resolve(null);
                  else {
                    const refCoords = (await ref.getCurrentCoords()).center;
                    const distance = Math.sqrt(
                      Math.pow(x - refCoords.x, 2) +
                        Math.pow(y - refCoords.y, 2)
                    );
                    if (distance <= distanceConstant) resolve(ref);
                    else resolve(null);
                  }
                })
            )
          )
        ).filter((data) => data);

        if (near.length) {
          near.forEach((ref) => ref.damage(GunsInfo.bg.damage * level));
          if (!zoneIntervalRef.current) {
            animate(
              circleScaleAnimatedValue,
              { toValue: 1, duration: 500 },
              () => circleScaleAnimatedValue.setValue(0)
            );
            zoneIntervalRef.current = setInterval(() => {
              animate(
                circleScaleAnimatedValue,
                { toValue: 1, duration: 500 },
                () => circleScaleAnimatedValue.setValue(0)
              );
            }, 500);
          }
        } else {
          clearInterval(zoneIntervalRef.current);
          zoneIntervalRef.current = null;
        }
      });
    }, 100);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return function cleanup() {
      stopInterval();
      clearInterval(zoneIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    let toValue = 0;
    if (isSelected) toValue = 1;
    animate(selectionAnimatedValue, { toValue, duration: 500 });
  }, [isSelected]);

  useEffect(() => {
    if (isActive) startInterval();
    else stopInterval();
  }, [isActive]);

  const renderSquare = (index, count, innerSize) => (
    <View
      key={index}
      style={{
        borderColor: "#68C3FB",
        width: innerSize,
        aspectRatio: 1,
        position: "absolute",
        borderWidth: size * 0.04,
        borderRadius: innerSize * 0.15,
        transform: [{ rotate: `${90 - (90 / count) * index}deg` }],
      }}
    ></View>
  );

  const renderArray = [0, 1, 2, 3].slice(0, level);

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        ref={gunRef}
        style={{
          width: size,
          aspectRatio: 1,
          borderRadius: "100%",
          borderColor: "#68C3FB",
          borderWidth: size * 0.04,
        }}
      ></View>
      {[renderArray, renderArray].map((array, arrayIndex) =>
        array.map((index) =>
          renderSquare(
            index,
            array.length,
            size * (1 - arrayIndex) + size * 0.3 * arrayIndex
          )
        )
      )}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          aspectRatio: 1,
          width: distanceConstant * 2,
          backgroundColor: "#68C3FB",
          borderRadius: 1000,
          transform: [{ scale: circleScaleAnimatedValue }],
          opacity: circleScaleAnimatedValue.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0.15, 0.15, 0],
          }),
        }}
      ></Animated.View>
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
