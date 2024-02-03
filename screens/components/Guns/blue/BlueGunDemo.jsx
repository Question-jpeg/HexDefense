import React from "react";
import { View } from "react-native";

export default function BlueGunDemo({ level, size }) {
  const renderSquare = (index, count, innerSize) => (
    <View
      key={index}
      style={{
        borderColor: "#68C3FB",
        width: innerSize,
        aspectRatio: 1,
        position: "absolute",
        borderWidth: size * 0.04,
        borderRadius: innerSize * 0.15,
        transform: [{ rotate: `${90 - (90 / count) * index}deg` }],
      }}
    ></View>
  );

  const renderArray = [0, 1, 2, 3].slice(0, level);

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: size,
          aspectRatio: 1,
          borderRadius: "100%",
          borderColor: "#68C3FB",
          borderWidth: size * 0.04,
        }}
      ></View>
      {[renderArray, renderArray].map((array, arrayIndex) =>
        array.map((index) =>
          renderSquare(
            index,
            array.length,
            size * (1 - arrayIndex) + size * 0.3 * arrayIndex
          )
        )
      )}
    </View>
  );
}
