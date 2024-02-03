import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Animated, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useGunProps from "../useGunProps";
import useGunLogic from "../useGunLogic";
import { getNearEntities } from "../../../../utils/getNearEntities";
import { getClosestEntity } from "./../../../../utils/getClosestEntity";
import { getTangensAngle } from "./../../../../utils/getTangensAngle";

const levelConfig = {
  1: { shotInterval: 300, holes: [0], strength: 1, hexRadius: 1 },
  2: { shotInterval: 150, holes: [-0.15, 0.15], strength: 1, hexRadius: 2 },
  3: { shotInterval: 100, holes: [-0.35, 0, 0.35], strength: 1, hexRadius: 2 },
  4: {
    shotInterval: 100,
    holes: [-0.35, 0, 0.35],
    strength: 1 + 1 / 3,
    hexRadius: 3,
  },
};

const WhiteGun = React.forwardRef(
  ({ level, size, cellSize, setBullets }, ref) => {
    const { shotInterval, holes, strength, hexRadius } = levelConfig[level];

    const {
      gunRef,
      intervalRef,
      entitiesRef,
      rotateAnimatedValue,
      selectionAnimatedValue,
    } = useGunProps();

    const bulletsCounter = useRef(0);
    const distanceConstant = cellSize * 1.1 * hexRadius + cellSize / 2;

    const tickFunc = async (gunCoords, x, y) => {
      const near = await getNearEntities(
        Object.values(entitiesRef.current),
        distanceConstant,
        { x, y }
      );

      if (near.length) {
        const targetEntity = getClosestEntity(near);
        const target = targetEntity.refCoords.center;

        const angle = getTangensAngle({ x, y }, target);
        rotateAnimatedValue.setValue(angle);

        const max = size * 0.6;
        const angleChange = holes[bulletsCounter.current % holes.length];
        setBullets((buls) => [
          ...buls,
          {
            coords: {
              x: Math.cos(angle + angleChange) * max,
              y: Math.sin(angle + angleChange) * max,
            },
            gunCoords,
            strength,
            target: { x: target.x - x, y: target.y - y },
            targetRef: targetEntity.ref,
            id: bulletsCounter.current++,
          },
        ]);
      }
    };

    useGunLogic({
      ref,
      gunRef,
      intervalRef,
      selectionAnimatedValue,
      tickFunc,
      tickIntervalValue: shotInterval,
    });

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
            borderColor: "white",
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
          }}
        >
          {level > 2 && (
            <>
              <View
                style={{
                  backgroundColor: "black",
                  position: "absolute",
                  transform: [
                    { rotate: "30deg" },
                    { translateX: -size * 0.45 },
                  ],
                  borderWidth: size * 0.04,
                  width: size * 0.25,
                  aspectRatio: 1,
                  borderColor: "white",
                  zIndex: 2,
                  elevation: 2,
                }}
              ></View>
              <View
                style={{
                  backgroundColor: "black",
                  position: "absolute",
                  transform: [
                    { rotate: "-30deg" },
                    { translateX: -size * 0.45 },
                  ],
                  borderWidth: size * 0.04,
                  width: size * 0.25,
                  aspectRatio: 1,
                  borderColor: "white",
                  zIndex: 2,
                  elevation: 2,
                }}
              ></View>
            </>
          )}
          <View
            style={{
              width: size * 0.6,
              aspectRatio: 1,
              borderRadius: "100%",
              borderColor: "white",
              borderWidth: size * 0.05,
              backgroundColor: "black",
              marginRight: level > 1 ? size * 0.15 : 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              elevation: 1,
            }}
          >
            {level === 4 && (
              <FontAwesome name="superpowers" size={size * 0.3} color="white" />
            )}
          </View>
          <View
            style={{
              position: "absolute",
              width: level < 2 ? size * 0.6 : size * 0.9,
              gap: level > 2 ? -size * 0.1 : -size * 0.05,
              right: -size * 0.2,
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                borderWidth: size * 0.04,
                borderColor: "white",
                height: size * 0.25,
              }}
            ></View>
            {level > 1 && (
              <View
                style={{
                  borderWidth: size * 0.04,
                  borderColor: "white",
                  height: size * 0.25,
                }}
              ></View>
            )}
            {level > 2 && (
              <View
                style={{
                  borderWidth: size * 0.04,
                  borderColor: "white",
                  height: size * 0.25,
                }}
              ></View>
            )}
          </View>
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
);

export default WhiteGun;
