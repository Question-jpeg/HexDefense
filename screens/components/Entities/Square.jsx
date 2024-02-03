import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Easing, View } from "react-native";
import { FieldContext } from "../../../utils/fieldContext";
import { animate } from "./../../../utils/animate";
import { getCoordinatedPath } from "./../../../game_logic/pathfinding/findPath";
import { rowColReverter } from "../../../utils/rowColDoubler";
import { offsetKpX, offsetKpY } from "../../../config/RenderInfo";
import { isTypeWalkable } from './../../../utils/isTypeWalkable';

export const renderSquare = () => (
  <View
    style={{
      width: "30%",
      borderWidth: 3,
      borderColor: "orange",
      aspectRatio: 1,
      position: "absolute",
    }}
  ></View>
);

const Square = React.forwardRef(
  ({ size, coords, instructionRef, destroySelf }, ref) => {
    const speed = 1 / 1000;

    const onLayoutAnimatedValue = useRef(new Animated.Value(0)).current;
    const moveAnimatedValue = useRef(new Animated.Value(0)).current;
    const currentMoveAnimatedValue = useRef(0);
    const offset = [coords[0] * size * offsetKpX, coords[1] * size * offsetKpY];

    const getMoveData = (path) => {
      const steps = path.length - 1;
      if (steps !== 0)
        return {
          path,
          steps,
          stepsMap: Array.from(Array(steps + 1).keys()),
          moveMap: path.map((coords) => [
            coords[0] * size * offsetKpX - offset[0],
            coords[1] * size * offsetKpY - offset[1],
          ]),
        };
      return null;
    };

    const moveDataRef = useRef(getMoveData(instructionRef.current));
    const planMoveDataRef = useRef();
    const [moveData, setMoveData] = useState(
      getMoveData(instructionRef.current)
    );

    const entityRef = useRef();

    const { gunChoicerRef, waveCountRef } = useContext(FieldContext);

    const waveCount = waveCountRef.current;
    const hpMax = 300 * waveCount;
    const hpRef = useRef(hpMax);
    const hpAnimatedValue = useRef(new Animated.Value(hpMax)).current;

    const animateMove = () => {
      const remainingTime =
        (moveData.steps - currentMoveAnimatedValue.current) / speed;
      animate(
        moveAnimatedValue,
        {
          toValue: moveData.steps,
          duration: remainingTime,
          easing: Easing.linear,
        },
        () => {
          if (currentMoveAnimatedValue.current === moveData.steps) {
            destroySelf();
          }
        }
      );
    };

    useImperativeHandle(ref, () => ({
      calculatePath: (newField, doubled, walkable) => {
        if (
          !moveDataRef.current.path.some(
            (cur) => cur[0] === doubled[0] && cur[1] === doubled[1]
          ) &&
          !walkable
        ) {
          planMoveDataRef.current = moveDataRef.current;
          return true;
        } else {
          const currentStep = Math.ceil(currentMoveAnimatedValue.current);
          const currentPosition = Math.floor(currentMoveAnimatedValue.current);

          const coordsStart = moveDataRef.current.path[currentStep];
          const coordsCurrent = moveDataRef.current.path[currentPosition];

          const path = getCoordinatedPath(newField, coordsStart, [8, 20]);

          const [revertedStepRow, revertedStepCol] = rowColReverter(
            coordsStart[1],
            coordsStart[0]
          );
          const [revertedCurrentRow, revertedCurrentCol] = rowColReverter(
            coordsCurrent[1],
            coordsCurrent[0]
          );

          if (
            isTypeWalkable(newField[revertedStepRow][revertedStepCol]) &&
            isTypeWalkable(newField[revertedCurrentRow][revertedCurrentCol]) &&
            path
          ) {
            const newPath = [
              ...moveDataRef.current.path.slice(0, currentStep),
              ...path,
            ];
            planMoveDataRef.current = getMoveData(newPath);

            return true;
          }

          return false;
        }
      },
      applyPath: () => {
        setMoveData(planMoveDataRef.current);
        moveDataRef.current = planMoveDataRef.current;
      },
      getCurrentCoords: () => {
        return new Promise((resolve) => {
          if (entityRef.current) {
            entityRef.current.measure((fx, fy, width, height, px, py) => {
              resolve({
                center: { x: px + width / 2, y: py + height / 2 },
                corners: [
                  { x: px, y: py },
                  { x: px + width, y: py },
                  { x: px, y: py + height },
                  { x: px + width, y: py + height },
                ],
                width,
                height,
              });
            });
          } else resolve(null);
        });
      },
      getRemainingSteps: () =>
        moveDataRef.current?.steps - currentMoveAnimatedValue.current,
      isDead: () => hpRef.current <= 0,
      damage: (quantity) => {
        if (hpRef.current > 0) {
          const hp = hpRef.current - quantity;
          hpRef.current = hp;
          hpAnimatedValue.setValue(hp < 0 ? 0 : hp);

          if (hp <= 0) {
            animate(
              onLayoutAnimatedValue,
              { toValue: 0, duration: 500 },
              () => {
                destroySelf();
              }
            );
            gunChoicerRef.current.addMoney(waveCount);
          }
        }
      },
    }));

    useEffect(() => {
      moveAnimatedValue.addListener(
        ({ value }) => (currentMoveAnimatedValue.current = value)
      );
      animate(onLayoutAnimatedValue, {
        toValue: 1,
        duration: 500,
      });
    }, []);

    useEffect(() => {
      if (moveData) {
        animateMove();
      }
    }, [moveData]);

    return (
      moveData && (
        <Animated.View
          ref={entityRef}
          style={{
            width: "30%",
            borderWidth: size * 0.06,
            borderColor: "orange",
            aspectRatio: 1,
            position: "absolute",
            opacity: onLayoutAnimatedValue,
            transform: [
              {
                translateX: moveAnimatedValue.interpolate({
                  inputRange: moveData.stepsMap,
                  outputRange: moveData.moveMap.map((coords) => coords[0]),
                }),
              },
              {
                translateY: moveAnimatedValue.interpolate({
                  inputRange: moveData.stepsMap,
                  outputRange: moveData.moveMap.map((coords) => coords[1]),
                }),
              },
              {
                rotate: onLayoutAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["180deg", "0deg"],
                }),
              },
            ],
          }}
        >
          <Animated.View
            style={{
              backgroundColor: "green",
              position: "absolute",
              width: "200%",
              transform: [
                {
                  scaleX: hpAnimatedValue.interpolate({
                    inputRange: [0, hpMax],
                    outputRange: [0, 1],
                  }),
                },
              ],
              opacity: hpAnimatedValue.interpolate({
                inputRange: [hpMax - 1, hpMax],
                outputRange: [1, 0],
              }),
              alignSelf: "center",
              bottom: -size * 0.25,
              height: size * 0.08,
            }}
          ></Animated.View>
        </Animated.View>
      )
    );
  }
);

Square.displayName = 'Square'

export default Square;
