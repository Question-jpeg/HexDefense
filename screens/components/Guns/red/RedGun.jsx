import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { FieldContext } from "../../../../utils/fieldContext";
import Rocket from "./Rocket";
import { animate } from "./../../../../utils/animate";

const levelConfig = {
  1: { holes: [-0.35], rotations: [0], shotInterval: 3000, count: 1 },
  2: { holes: [-0.3, 0.3], rotations: [0, 0], shotInterval: 3000, count: 2 },
  3: { holes: [-0.3, 0.3], rotations: [0, 0], shotInterval: 2000, count: 2 },
  4: {
    holes: [-0.9, 0, 0.9],
    rotations: [-0.5, 0, 0.5],
    shotInterval: 2000,
    count: 3,
  },
};

export default function RedGun({ level, size, cellSize, coords }) {
  const { holes, rotations, shotInterval, count } = levelConfig[level];

  const rotateAnimatedValue = useRef(new Animated.Value(0)).current;
  const selectionAnimatedValue = useRef(new Animated.Value(0)).current;

  const { entitiesRef, selectedGun } = useContext(FieldContext);

  const gunRef = useRef();

  const bulletsCounter = useRef(0);
  const [bullets, setBullets] = useState([]);

  const intervalRef = useRef();

  const distanceConstant =
    cellSize * 1.1 * (level < 2 ? 1 : level < 4 ? 2 : 3) + cellSize / 2;

  useEffect(() => {
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
                    if (distance <= distanceConstant)
                      resolve({ ref, refCoords });
                    else resolve(null);
                  }
                })
            )
          )
        ).filter((data) => data);

        const targetEntity = near.reduce(
          (prev, cur) =>
            cur.ref.getRemainingSteps() < prev.ref.getRemainingSteps()
              ? cur
              : prev,
          { ref: { getRemainingSteps: () => 999 } }
        );

        const target = targetEntity.refCoords;

        if (target) {
          const coef = (target.y - y) / (target.x - x);
          const angle = Math.atan(coef) + (target.x < x ? Math.PI : 0);
          rotateAnimatedValue.setValue(angle);

          const max = size * 0.6;
          setBullets((buls) => [
            ...buls,
            ...Array.from(Array(count)).map(() => {
              const angleChange = holes[bulletsCounter.current % holes.length];
              const rotation =
                rotations[bulletsCounter.current % rotations.length];
              return {
                coords: {
                  x: Math.cos(angle + angleChange) * max,
                  y: Math.sin(angle + angleChange) * max,
                },
                gunCoords,
                angle: angle + rotation,
                id: bulletsCounter.current++,
              };
            }),
          ]);
        }
      });
    }, shotInterval);

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

  const renderGunPount = (index) => (
    <View
      style={{
        borderWidth: size * 0.04,
        width: level === 1 ? size * 1.1 : level === 4 ? size * 0.9 : size,
        height: level === 1 ? size / 3 : level === 4 ? size * 0.3 : size / 3.25,
        borderColor: "red",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: index === 1 ? "flex-start" : "flex-end",
        gap: size * 0.07,
        paddingRight: size * 0.1,
        marginLeft: level === 2 ? size * 0.1 : level === 4 ? size * 0.3 : 0,
        borderBottomLeftRadius: level === 1 ? 0 : "100%",
        borderTopLeftRadius: level === 1 ? 0 : "100%",
        transform: [
          {
            rotate:
              level === 4
                ? index === 1
                  ? "-30deg"
                  : index === 3
                  ? "30deg"
                  : "0deg"
                : "0deg",
          },
        ],
        zIndex: index === 2 ? 5 : 0,
        elevation: index === 2 ? 5 : 0,
      }}
    >
      {[1, 2, 3, level === 4 ? 4 : null]
        .filter((key) => key)
        .map((key) => (
          <View
            key={key}
            style={{
              width: size * 0.03,
              height: "50%",
              backgroundColor: "red",
              transform: [{ rotate: index === 1 ? "15deg" : "-15deg" }],
            }}
          ></View>
        ))}
    </View>
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
          borderColor: "red",
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
        {level === 1 ? (
          <>
            {renderGunPount(1)}
            <View
              style={{
                borderWidth: size * 0.04,
                width: size / 2,
                height: size / 4,
                borderColor: "red",
                marginBottom: size * 0.2,
                backgroundColor: "black",
              }}
            ></View>
          </>
        ) : level === 2 ? (
          <>
            {renderGunPount(1)}
            {renderGunPount(2)}
          </>
        ) : level === 3 ? (
          <>
            <View
              style={{
                borderWidth: size * 0.04,
                width: size * 0.5,
                height: size * 0.2,
                borderColor: "red",
                backgroundColor: "black",
                marginRight: size * 0.2,
              }}
            ></View>
            {renderGunPount(1)}
            {renderGunPount(2)}
            <View
              style={{
                borderWidth: size * 0.04,
                width: size * 0.5,
                height: size * 0.2,
                borderColor: "red",
                backgroundColor: "black",
                marginRight: size * 0.2,
              }}
            ></View>
          </>
        ) : (
          <>
            {renderGunPount(1)}
            {renderGunPount(2)}
            {renderGunPount(3)}
            <View
              style={{
                position: "absolute",
                aspectRatio: 1,
                width: size * 0.6,
                borderColor: "red",
                borderWidth: size * 0.05,
                borderRadius: "100%",
                left: 0,
                backgroundColor: "black",
              }}
            ></View>
          </>
        )}
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
      {bullets.map((bullet) => {
        return (
          <Rocket
            key={bullet.id}
            initAngle={bullet.angle}
            coords={bullet.coords}
            gunCoords={bullet.gunCoords}
            size={size * 0.4}
            destroySelf={() =>
              setBullets((buls) => buls.filter((bult) => bult.id !== bullet.id))
            }
          />
        );
      })}
    </View>
  );
}
