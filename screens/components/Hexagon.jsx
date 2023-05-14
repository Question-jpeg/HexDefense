import React from "react";
import { View } from "react-native";

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

export default function Hexagon({ size, color, style, children }) {
  const hexagonStyles = getHexagonStyles(size, color);
  return (
    <View
      style={{
        ...hexagonStyles.hexagon,
        transform: [{ rotate: "90deg" }],
        ...style,
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
        {children}
      </View>
    </View>
  );
}
