import React, { useEffect, useRef, useState } from "react";
import { Alert, Text } from "react-native";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import Hexagon from "./components/Hexagon";
import Spawner from "./components/Spawner";
import { rowColDoubler } from "./../utils/rowColDoubler";
import { getConvertedField } from "./../utils/convertField";
import { FieldContext } from "../utils/fieldContext";
import { Node } from "../game_logic/pathfinding/Node";
import GunChoicer from "./components/GunChoicer";
import WhiteGun from "./components/Guns/white/WhiteGun";
import GreenGun from "./components/Guns/green/GreenGun";
import RedGun from "./components/Guns/red/RedGun";
import BlueGun from "./components/Guns/blue/BlueGun";

const screenWidth = Dimensions.get("screen").width;

export default function FieldScreen() {
  const [field, setField] = useState(
    getConvertedField([
      [true, false, true, true, true, true, true, true, true],
      ["s", true, false, false, true, true, true, true, true],
      [false, false, true, true, false, true, true, "wg_3", true],
      [true, true, false, true, false, false, true, true, true],
      [true, true, false, false, true, false, true, "rg_1", true],
      [true, true, true, false, true, false, true, true, true],
      [true, "rg_1", true, "bg_1", true, false, true, true, true],
      [true, true, true, false, true, false, true, true, true],
      [true, true, true, false, true, false, true, true, true],
      [true, "gg_1", true, false, true, true, true, false, true],
      [true, true, true, false, false, true, false, true, true],
    ])
  );

  const [selectedGun, setSelectedGun] = useState([]);

  const numberInRow = field[0].length;
  const size = screenWidth / numberInRow;

  const spawners = useRef([]);
  const entitiesRef = useRef({});

  const selectionRef = useRef();

  const addSpawner = (ref) => {
    if (ref && spawners.current.every((obj) => obj.id !== ref.id))
      spawners.current.push(ref);
  };

  const addEntity = (ref, id) => {
    if (ref) entitiesRef.current[id] = ref;
  };

  const removeEntity = (id) => {
    delete entitiesRef.current[id];
  };

  const placeObstacle = (row, col, doubled) => {
    const node = field[row][col];

    const newField = field.map((row) =>
      row.map((node) => Node.createFromNode(node))
    );
    newField[row][col].Type = `${selectionRef.current}g_1`;

    const spawnersResponse = spawners.current.map((ref) =>
      ref.calculatePath(newField, doubled, !node.Type)
    );
    const entitiesResponse = Object.values(entitiesRef.current).map((ref) =>
      ref.calculatePath(newField, doubled, !node.Type)
    );

    if ([...spawnersResponse, ...entitiesResponse].every((value) => value))
      setField(newField);
  };

  const renderHexagon = (row, col) => {
    const node = field[row][col];
    const [dRow, dCol] = rowColDoubler(row, col);

    const strType = node.Type.toString();
    const isGun = strType.includes("g");
    const gunLevel = isGun && Number.parseInt(strType.split("_")[1]);

    const zIndex = isGun
      ? strType.includes("rg")
        ? 4
        : 3
      : node.Type === "s"
      ? 2
      : node.Type === false
      ? 1
      : 0;

    const renderView = () => (
      <Hexagon
        color={
          node.Type === "s"
            ? "#6F222C"
            : node.Type === false
            ? colors.background
            : "black"
        }
        size={size}
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
            coords={[row, col]}
          />
        ) : strType.includes("rg") ? (
          <RedGun
            size={size * 0.8}
            level={gunLevel}
            cellSize={size}
            coords={[row, col]}
          />
        ) : strType.includes("gg") ? (
          <GreenGun
            size={size * 0.8}
            level={gunLevel}
            cellSize={size}
            coords={[row, col]}
          />
        ) : (
          strType.includes("bg") && (
            <BlueGun
              size={size * 0.8}
              level={gunLevel}
              cellSize={size}
              coords={[row, col]}
            />
          )
        )}
      </Hexagon>
    );

    const style = {
      zIndex,
      elevation: zIndex,
      marginTop: col % 2 ? size / 1.9 : 0,
    };

    const key = `${row} ${col}`;

    return node.Type === "s" ? (
      <View style={style} key={key}>
        {renderView()}
      </View>
    ) : (
      <TouchableOpacity
        onPress={() => {
          if (isGun) setSelectedGun([row, col]);
          else {
            if (node.Type && selectionRef.current) {
              placeObstacle(row, col, [dCol, dRow]);
            } else {
              setSelectedGun([]);
            }
          }
        }}
        style={style}
        key={key}
      >
        {renderView()}
      </TouchableOpacity>
    );
  };

  return (
    <FieldContext.Provider
      value={{ field, entitiesRef, selectionRef, selectedGun }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 50 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: screenWidth + 1,
            justifyContent: "center",
            columnGap: -size / 13,
            rowGap: -size / 15,
          }}
        >
          {Array.from(Array(field.length).keys()).map((row) =>
            Array.from(Array(field[row].length).keys()).map((col) => {
              return renderHexagon(row, col);
            })
          )}
        </View>
      </View>
      <GunChoicer />
    </FieldContext.Provider>
  );
}
