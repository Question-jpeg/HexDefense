import React, { useRef } from "react";
import { View, Dimensions } from "react-native";
import Hexagon from "./components/Hexagon";
import { rowColDoubler } from "./../utils/rowColDoubler";
import { getConvertedField } from "./../utils/convertField";
import { FieldContext } from "../utils/fieldContext";
import { Node } from "../game_logic/pathfinding/Node";
import GunChoicer from "./components/GunChoicer";
import GunsInfo from "../config/GunsInfo";
import WaveCounter from "./components/WaveCounter";

const screenWidth = Dimensions.get("screen").width;

export default function FieldScreen() {
  const fieldRef = useRef(
    getConvertedField([
      [true, false, true, true, true, true, true, true, true],
      ["s", true, false, false, true, true, true, true, true],
      [false, false, true, true, false, true, true, true, true],
      [true, true, false, true, true, false, true, true, true],
      [true, true, false, false, true, false, true, true, true],
      [true, true, true, true, true, false, true, true, true],
      [true, true, true, true, true, false, true, true, true],
      [true, true, true, true, true, false, true, true, true],
      [true, true, true, false, true, false, true, true, true],
      [true, true, true, false, true, true, true, false, true],
      [true, true, true, false, true, true, false, true, true],
    ])
  );

  const numberInRow = fieldRef.current[0].length;
  const size = screenWidth / numberInRow;

  const spawnersRef = useRef([]);
  const entitiesRef = useRef({});
  const hexRef = useRef({});

  const selectionRef = useRef();
  const selectedGunRef = useRef();

  const gunChoicerRef = useRef();
  const waveCounterRef = useRef();

  const addHex = (ref, row, col) => {
    if (ref)
      hexRef.current[row]
        ? (hexRef.current[row][col] = ref)
        : (hexRef.current[row] = { [col]: ref });
  };

  const addSpawner = (ref) => {
    if (ref && spawnersRef.current.every((obj) => obj.id !== ref.id))
      spawnersRef.current.push(ref);
  };

  const addEntity = (ref, id) => {
    if (ref) entitiesRef.current[id] = ref;
  };

  const removeEntity = (id) => {
    delete entitiesRef.current[id];
  };

  const placeObstacle = (row, col, type) => {
    const [dRow, dCol] = rowColDoubler(row, col);
    const doubled = [dCol, dRow];

    const newField = fieldRef.current.map((row) =>
      row.map((node) => Node.createFromNode(node))
    );

    const node = newField[row][col];
    node.Type = type;

    const spawners = spawnersRef.current;
    const entities = Object.values(entitiesRef.current);

    const spawnersResponse = spawners.map((ref) =>
      ref.calculatePath(newField, doubled, node.Walkable)
    );

    const entitiesResponse = entities.map((ref) =>
      ref.calculatePath(newField, doubled, node.Walkable)
    );

    if ([...spawnersResponse, ...entitiesResponse].every((value) => value)) {
      hexRef.current[row][col].setNodeType(node.Type);
      fieldRef.current = newField;
      spawners.forEach((ref) => ref.applyPath());
      entities.forEach((ref) => ref.applyPath());
    }
  };

  const renderHexagon = (row, col) => {
    const node = fieldRef.current[row][col];

    return (
      <Hexagon
        key={`${row}${col}`}
        ref={(ref) => addHex(ref, row, col)}
        row={row}
        col={col}
        type={node.Type}
        size={size}
        addSpawner={addSpawner}
        addEntity={addEntity}
        removeEntity={removeEntity}
        gunChoicerRef={gunChoicerRef}
        selectedGunRef={selectedGunRef}
        onPress={(nodeType) => {
          const strType = nodeType.toString();
          const isGun = strType.includes("g");
          const selGun = selectedGunRef.current;

          if (isGun) {
            if (selGun) hexRef.current[selGun.row][selGun.col].deselect();
            hexRef.current[row][col].select();
            selectedGunRef.current = { row, col };
            gunChoicerRef.current.setSelectedGun(nodeType);
          } else {
            if (selGun) {
              hexRef.current[selGun.row][selGun.col].deselect();
              selectedGunRef.current = null;
              gunChoicerRef.current.setSelectedGun(null);
            }
            if (selectionRef.current && nodeType && !selGun) {
              if (gunChoicerRef.current.isAvailable()) {
                gunChoicerRef.current.addMoney(
                  -GunsInfo[`${selectionRef.current}g`].costs[0]
                );
                placeObstacle(row, col, `${selectionRef.current}g_1`);
              }
            }
          }
        }}
      />
    );
  };

  return (
    <FieldContext.Provider
      value={{ fieldRef, entitiesRef, gunChoicerRef, waveCounterRef }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 50 }}>
        <WaveCounter ref={waveCounterRef} />
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
          {Array.from(Array(fieldRef.current.length).keys()).map((row) =>
            Array.from(Array(fieldRef.current[row].length).keys()).map(
              (col) => {
                return renderHexagon(row, col);
              }
            )
          )}
        </View>
      </View>
      <GunChoicer
        ref={gunChoicerRef}
        selectionRef={selectionRef}
        selectedGunRef={selectedGunRef}
        removeGun={() => {
          const selGun = selectedGunRef.current;

          const data = fieldRef.current[selGun.row][selGun.col].Type.split("_");
          const [curType, curLevel] = [data[0], Number.parseInt(data[1])];

          placeObstacle(selGun.row, selGun.col, true);
          hexRef.current[selGun.row][selGun.col].deselect();

          selectedGunRef.current = null;
          gunChoicerRef.current.setSelectedGun(null);
          gunChoicerRef.current.addMoney(GunsInfo[curType].sells[curLevel - 1]);
        }}
        upgradeGun={() => {
          const selGun = selectedGunRef.current;
          const data = fieldRef.current[selGun.row][selGun.col].Type.split("_");
          const [curType, curLevel] = [data[0], Number.parseInt(data[1])];

          const newType = `${curType}_${curLevel + 1}`;

          fieldRef.current[selGun.row][selGun.col].Type = newType;
          hexRef.current[selGun.row][selGun.col].upgrade(newType);
          gunChoicerRef.current.addMoney(-GunsInfo[curType].costs[curLevel]);
        }}
      />
    </FieldContext.Provider>
  );
}
