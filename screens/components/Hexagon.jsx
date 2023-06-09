import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { rowColDoubler } from "../../utils/rowColDoubler";
import { colors } from "./../../utils/colors";
import Spawner from "./Spawner";
import WhiteGun from "./Guns/white/WhiteGun";
import RedGun from "./Guns/red/RedGun";
import GreenGun from "./Guns/green/GreenGun";
import BlueGun from "./Guns/blue/BlueGun";
import Rocket from "./Guns/red/Rocket";
import WhiteBullet from "./Guns/white/WhiteBullet";
import ProgressPie from "./ProgressPie";

const getHexagonStyles = (size, color = "black") => {
  const coef = size / 90;
  return {
    hexagon: {
      width: 90 * coef,
      height: 55 * coef,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    hexagonInner: {
      width: 90 * coef,
      height: 55 * coef,
      backgroundColor: color,
    },
    hexagonAfter: {
      position: "absolute",
      bottom: -25 * coef,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderLeftWidth: 45 * coef,
      borderLeftColor: "transparent",
      borderRightWidth: 45 * coef,
      borderRightColor: "transparent",
      borderTopWidth: 28 * coef,
      borderTopColor: color,
    },
    hexagonBefore: {
      position: "absolute",
      top: -25 * coef,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderLeftWidth: 45 * coef,
      borderLeftColor: "transparent",
      borderRightWidth: 45 * coef,
      borderRightColor: "transparent",
      borderBottomWidth: 28 * coef,
      borderBottomColor: color,
    },
  };
};

const Hexagon = React.forwardRef(
  (
    {
      row,
      col,
      size,
      type,
      addSpawner,
      addEntity,
      removeEntity,
      onPress,
      gunChoicerRef,
    },
    ref
  ) => {
    const [dRow, dCol] = rowColDoubler(row, col);

    const [nodeType, setNodeType] = useState(type);
    const strType = nodeType.toString();
    const isGun = strType.includes("g");
    const gunLevel = isGun && Number.parseInt(strType.split("_")[1]);

    const [isSelected, setIsSelected] = useState(false);
    const [rockets, setRockets] = useState([]);
    const [bullets, setBullets] = useState([]);
    const [translation, setTranslation] = useState();

    const gunSpawnerRef = useRef();

    const progressPieRef = useRef();
    const [isActive, setIsActive] = useState(true);

    useImperativeHandle(ref, () => ({
      setNodeType,
      deselect: () => setIsSelected(false),
      select: () => setIsSelected(true),
      upgrade: (newType) => {
        setIsActive(false);
        gunChoicerRef.current.addUpgrading({ row, col });
        progressPieRef.current.animate(() => {
          setNodeType(newType);
          setIsActive(true);
          gunChoicerRef.current.removeUpgrading({ row, col }, newType);
        });
      },
    }));

    useEffect(() => {
      if ((rockets.length || bullets.length) && !translation) {
        gunSpawnerRef.current.measure((fx, fy, width, height, px, py) => {
          let gunCoords;
          if (rockets.length) gunCoords = rockets[0].gunCoords;
          else gunCoords = bullets[0].gunCoords;
          setTranslation({ x: gunCoords.x - px, y: gunCoords.y - py });
        });
      }
    }, [rockets, bullets]);

    const renderView = () => {
      return (
        <View
          style={{
            ...hexagonStyles.hexagon,
            transform: [{ rotate: "90deg" }],
          }}
        >
          <View style={hexagonStyles.hexagonInner} />
          <View style={hexagonStyles.hexagonBefore} />
          <View style={hexagonStyles.hexagonAfter} />
          <View
            style={{
              position: "absolute",
              transform: [{ rotate: "-90deg" }],
              width: "120%",
              aspectRatio: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {strType === "s" ? (
              <Spawner
                ref={addSpawner}
                coords={[dCol, dRow]}
                size={size}
                addEntity={addEntity}
                removeEntity={removeEntity}
              />
            ) : strType.includes("wg") ? (
              <WhiteGun
                size={size * 0.8}
                level={gunLevel}
                cellSize={size}
                isSelected={isSelected}
                isActive={isActive}
                setBullets={setBullets}
              />
            ) : strType.includes("rg") ? (
              <RedGun
                size={size * 0.8}
                level={gunLevel}
                cellSize={size}
                isSelected={isSelected}
                isActive={isActive}
                setRockets={setRockets}
              />
            ) : strType.includes("gg") ? (
              <GreenGun
                size={size * 0.8}
                level={gunLevel}
                cellSize={size}
                isSelected={isSelected}
                isActive={isActive}
              />
            ) : (
              strType.includes("bg") && (
                <BlueGun
                  size={size * 0.8}
                  level={gunLevel}
                  cellSize={size}
                  isSelected={isSelected}
                  isActive={isActive}
                />
              )
            )}
            <ProgressPie ref={progressPieRef} size={size} />
          </View>
        </View>
      );
    };

    const hexagonStyles = getHexagonStyles(
      size,
      nodeType === "s"
        ? "#6F222C"
        : nodeType === false
        ? colors.background
        : "black"
    );

    const zIndex = isGun
      ? strType.includes("bg")
        ? 4
        : 3
      : nodeType === "s"
      ? 2
      : nodeType === false
      ? 1
      : 0;

    const style = {
      zIndex,
      elevation: zIndex,
      marginTop: col % 2 ? size / 1.9 : 0,
    };

    return nodeType === "s" ? (
      <View style={style}>{renderView()}</View>
    ) : (
      <>
        <TouchableOpacity onPress={() => onPress(nodeType)} style={style}>
          {renderView()}
        </TouchableOpacity>

        <View
          ref={gunSpawnerRef}
          style={{
            zIndex: 6,
            elevation: 6,
            position: "absolute",
            backgroundColor: "yellow",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: translation
              ? [{ translateX: translation.x }, { translateY: translation.y }]
              : [],
          }}
        >
          {translation && [
            ...rockets.map((rocket) => {
              return (
                <Rocket
                  key={rocket.id}
                  initAngle={rocket.angle}
                  coords={rocket.coords}
                  gunCoords={rocket.gunCoords}
                  size={size * 0.4}
                  destroySelf={() =>
                    setRockets((rocks) =>
                      rocks.filter((rock) => rock.id !== rocket.id)
                    )
                  }
                />
              );
            }),
            ...bullets.map((bullet) => {
              return (
                <WhiteBullet
                  key={bullet.id}
                  coords={bullet.coords}
                  target={bullet.target}
                  targetRef={bullet.targetRef}
                  strength={bullet.strength}
                  size={size * 0.18}
                  destroySelf={() =>
                    setBullets((buls) =>
                      buls.filter((bult) => bult.id !== bullet.id)
                    )
                  }
                />
              );
            }),
          ]}
        </View>
      </>
    );
  }
);

export default Hexagon;
