import React, { useContext, useEffect, useRef } from "react";
import { Animated, Easing, View, Dimensions } from "react-native";
import GunsInfo from "../../../../config/GunsInfo";
import { animate } from "../../../../utils/animate";
import { FieldContext } from "../../../../utils/fieldContext";
import { getTangensAngle } from "./../../../../utils/getTangensAngle";
import { getNearEntities } from "./../../../../utils/getNearEntities";
import { getClosestEntity } from "./../../../../utils/getClosestEntity";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function Rocket({
  size,
  coords,
  distanceConstant,
  gunCoords,
  initAngle,
  destroySelf,
}) {
  const speed = 10;
  const interval = 50;
  const maxAngle = Math.PI / 9;

  const xRef = useRef(gunCoords.x + coords.x);
  const yRef = useRef(gunCoords.y + coords.y);
  const angleRef = useRef(initAngle);

  const xAnimatedValue = useRef(new Animated.Value(coords.x)).current;
  const yAnimatedValue = useRef(new Animated.Value(coords.y)).current;
  const angleAnimatedValue = useRef(new Animated.Value(initAngle)).current;

  const { entitiesRef } = useContext(FieldContext);

  const mainStep = async () => {
    const currentAngle =
      angleRef.current -
      parseInt(angleRef.current / (Math.PI * 2)) * Math.PI * 2;

    xRef.current += Math.cos(currentAngle) * speed;
    yRef.current += Math.sin(currentAngle) * speed;

    const x = xRef.current;
    const y = yRef.current;

    if (
      y > screenHeight + 100 ||
      y < -100 ||
      x > screenWidth + 100 ||
      x < -100
    ) {
      destroySelf();
      return;
    }

    animate(xAnimatedValue, {
      toValue: xRef.current - gunCoords.x,
      duration: interval,
      easing: Easing.linear,
    });
    animate(yAnimatedValue, {
      toValue: yRef.current - gunCoords.y,
      duration: interval,
      easing: Easing.linear,
    });

    const near = await getNearEntities(
      Object.values(entitiesRef.current),
      distanceConstant,
      { x, y }
    );

    if (near.length) {
      const targetEntity = getClosestEntity(near);
      const targetRef = targetEntity.ref
      const targetCoords = targetEntity.refCoords;
      const target = targetCoords.center;
      
      const distance = Math.sqrt(
        Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2)
      );

      if (distance < targetCoords.width * 0.5) {
        destroySelf();
        targetRef?.damage(GunsInfo.rg.damage);
        return;
      }

      const angle = getTangensAngle({ x, y }, target);

      let turnAngle = 0;

      if (angle > currentAngle) {
        const rightDiff = angle - currentAngle;
        if (rightDiff > Math.PI)
          turnAngle = -(currentAngle + Math.PI * 2 - angle);
        else turnAngle = rightDiff;
      } else {
        const leftDiff = angle - currentAngle;
        if (leftDiff < -Math.PI) turnAngle = angle + Math.PI * 2 - currentAngle;
        else turnAngle = leftDiff;
      }

      angleRef.current +=
        Math.abs(turnAngle) > maxAngle
          ? turnAngle > 0
            ? maxAngle
            : -maxAngle
          : turnAngle;

      animate(
        angleAnimatedValue,
        {
          toValue: angleRef.current,
          duration: interval,
          easing: Easing.linear,
        },
        mainStep
      );
      return;
    }
    setTimeout(mainStep, interval);
  };

  useEffect(() => {
    mainStep();    
  }, []);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        height: size * 0.7,
        borderLeftWidth: size,
        borderBottomWidth: size * 0.3,
        borderTopWidth: size * 0.3,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        borderLeftColor: "orange",
        borderRadius: "100%",
        position: "absolute",
        // shadowOpacity: 1,
        // shadowOffset: { width: 0, height: 0 },
        // shadowColor: "orange",
        // shadowRadius: 10,
        transform: [
          {
            translateX: xAnimatedValue,
          },
          {
            translateY: yAnimatedValue,
          },
          {
            rotate: angleAnimatedValue.interpolate({
              inputRange: [0, Math.PI * 2],
              outputRange: ["0deg", `360deg`],
            }),
          },
        ],
      }}
    ></Animated.View>
  );
}
