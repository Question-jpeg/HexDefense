import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { animate } from "../../../../utils/animate";

export default function WhiteBullet({
  target,
  targetRef,
  size,
  coords,
  strength,
  destroySelf,
}) {
  const speed = 600 / 1000;
  const tAV = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(target.x - coords.x, 2) + Math.pow(target.y - coords.y, 2)
    );

    animate(
      tAV,
      { toValue: 1, duration: distance / speed, easing: Easing.linear },
      () => {
        destroySelf();
        targetRef.damage(15*strength)
      }
    );
  }, []);

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        width: size,
        aspectRatio: 1,
        borderRadius: "100%",
        position: "absolute",
        transform: [
          {
            translateX: tAV.interpolate({
              inputRange: [0, 1],
              outputRange: [coords.x, target.x],
            }),
          },
          {
            translateY: tAV.interpolate({
              inputRange: [0, 1],
              outputRange: [coords.y, target.y],
            }),
          },
        ],
      }}
    ></Animated.View>
  );
}
