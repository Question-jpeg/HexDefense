import React, { useContext, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import GunsInfo from "../../../../config/GunsInfo";
import { FieldContext } from "../../../../utils/fieldContext";
import { getNearEntities } from "../../../../utils/getNearEntities";
import useGunProps from "../useGunProps";
import { animate } from "./../../../../utils/animate";
import useGunLogic from "./../useGunLogic";

const BlueGun = React.forwardRef(({ level, size, cellSize }, ref) => {
  const { entitiesRef, gunRef, intervalRef, selectionAnimatedValue } =
    useGunProps();
  const circleScaleAnimatedValue = useRef(new Animated.Value(0)).current;
  const zoneIntervalRef = useRef();
  const distanceConstant = cellSize * (level < 3 ? 1 : 2) * 1.1 + cellSize / 2;

  const tickFunc = async (gunCoords, x, y) => {
    const near = await getNearEntities(
      Object.values(entitiesRef.current),
      distanceConstant,
      { x, y }
    );

    if (near.length) {
      near.forEach((entity) => entity.ref.damage(GunsInfo.bg.damage * level));
      if (!zoneIntervalRef.current) {
        animate(circleScaleAnimatedValue, { toValue: 1, duration: 500 }, () =>
          circleScaleAnimatedValue.setValue(0)
        );
        zoneIntervalRef.current = setInterval(() => {
          animate(circleScaleAnimatedValue, { toValue: 1, duration: 500 }, () =>
            circleScaleAnimatedValue.setValue(0)
          );
        }, 500);
      }
    } else {
      clearInterval(zoneIntervalRef.current);
      zoneIntervalRef.current = null;
    }
  };

  useGunLogic({
    ref,
    gunRef,
    intervalRef,
    selectionAnimatedValue,
    tickFunc,
    tickIntervalValue: 100,
    funcExtension: {
      stopInterval: () => {
        clearInterval(zoneIntervalRef.current);
        zoneIntervalRef.current = null;
      },
    },
  });

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
});

export default BlueGun;
