import React, { useContext, useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import GunsInfo from "../../../../config/GunsInfo";
import { FieldContext } from "../../../../utils/fieldContext";
import { animate } from "./../../../../utils/animate";
import { Feather } from "@expo/vector-icons";
import useGunProps from "../useGunProps";
import useGunLogic from "./../useGunLogic";
import { getNearEntities } from "./../../../../utils/getNearEntities";
import { getTangensAngle } from "../../../../utils/getTangensAngle";

const GreenGun = React.forwardRef(({ level, size, cellSize }, ref) => {
  const {
    entitiesRef,
    gunRef,
    intervalRef,
    rotateAnimatedValue,
    selectionAnimatedValue,
  } = useGunProps();
  const lazerAnimatedValue = useRef(new Animated.Value(0)).current;
  const distanceConstant = cellSize * 1.1 * 2 + cellSize / 2;

  const tickFunc = async (gunCoords, x, y) => {
    const entitiesData = await getNearEntities(
      Object.values(entitiesRef.current),
      distanceConstant,
      { x, y },
      { searchNear: false }
    );

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
          return getTangensAngle({ x, y }, { x: refX, y: refY });
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
            if (interval.isEdgeCase && angleInterval.isEdgeCase) return true;
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

      const edgeValues = mostValuableIntervalSet
        .flatMap((interval) => [interval.start, interval.end])
        .sort();

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
      animate(
        lazerAnimatedValue,
        { toValue: 1, duration: 300, easing: Easing.linear },
        () => lazerAnimatedValue.setValue(0)
      );
      resultRefs.forEach((ref) => ref.damage(GunsInfo.gg.damage * level));
    }
  };

  useGunLogic({
    ref,
    gunRef,
    intervalRef,
    selectionAnimatedValue,
    tickFunc,
    tickIntervalValue: 1000,
  });

  const renderLazer = () => {
    return (
      <View
        style={{
          borderWidth: size * 0.04,
          borderColor: "#6DF826",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          borderBottomLeftRadius: level === 4 ? 0 : "100%",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "lightgreen",
            width: 2000,
            height: level === 4 ? 1 : 0.5,
            opacity: lazerAnimatedValue.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, 1, 0.5, 1, 0],
            }),
          }}
        ></Animated.View>
      </View>
    );
  };

  const renderTrapezoid = () => {
    return (
      <Feather
        name="triangle"
        size={size * 0.8}
        color="#6DF826"
        style={{ position: "absolute", transform: [{ rotate: "90deg" }] }}
      />
    );
  };

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
        <View
          style={{
            width: size,
            gap: level === 4 ? -size * 0.3 : -size * 0.05,
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
        {level === 4 && renderTrapezoid()}
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
});

export default GreenGun;
