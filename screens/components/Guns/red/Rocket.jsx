import React, { useContext, useEffect, useRef } from "react";
import { Animated, Easing, View, Dimensions } from "react-native";
import GunsInfo from "../../../../config/GunsInfo";
import { animate } from "../../../../utils/animate";
import { FieldContext } from "../../../../utils/fieldContext";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function Rocket({
  size,
  coords,
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
    const angleToWork =
      angleRef.current -
      Number.parseInt(angleRef.current / (Math.PI * 2)) * Math.PI * 2;

    xRef.current += Math.cos(angleToWork) * speed;
    yRef.current += Math.sin(angleToWork) * speed;

    const x = xRef.current;
    const y = yRef.current;

    if (y > screenHeight + 100 || y < -100 || x > screenWidth + 100 || x < -100)
      destroySelf();
    else {
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

      const entities = Object.values(entitiesRef.current).filter(
        (ref) => !ref.isDead()
      );

      if (entities.length) {
        const targetEntity = entities.reduce(
          (prev, cur) =>
            cur.getRemainingSteps() < prev.getRemainingSteps() ? cur : prev,
          { getRemainingSteps: () => 999 }
        );

        const targetCoords = await targetEntity.getCurrentCoords();
        const target = targetCoords.center;
        const distance = Math.sqrt(
          Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2)
        );
        if (distance < targetCoords.width * 0.5) {
          destroySelf();
          targetEntity && targetEntity.damage(GunsInfo.rg.damage);
        } else {
          const coef = (target.y - y) / (target.x - x);
          const angle = Math.atan(coef) + (target.x < x ? Math.PI : 0);

          let turnAngle = 0;

          if (angle > angleToWork) {
            const rightDiff = angle - angleToWork;
            if (rightDiff > Math.PI)
              turnAngle = -(angleToWork + Math.PI * 2 - angle);
            else turnAngle = rightDiff;
          } else {
            const leftDiff = angle - angleToWork;
            if (leftDiff < -Math.PI)
              turnAngle = angle + Math.PI * 2 - angleToWork;
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
        }
      } else {
        setTimeout(mainStep, interval);
      }
    }
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
              outputRange: ["0rad", `${Math.PI * 2}rad`],
            }),
          },
        ],
      }}
    ></Animated.View>
  );
}
