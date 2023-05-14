import React from "react";
import { View } from "react-native";

export default function BlueGunLevel1Demo({ size }) {
  const renderSquare = (index, innerSize) => (
    <View
      key={index}
      style={{
        borderColor: "#68C3FB",
        width: innerSize,
        aspectRatio: 1,
        position: "absolute",
        borderWidth: size * 0.04,
        borderRadius: innerSize * 0.15,
      }}
    ></View>
  );

  const renderArray = [0];

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
          renderSquare(index, size * (1 - arrayIndex) + size * 0.3 * arrayIndex)
        )
      )}
    </View>
  );
}
