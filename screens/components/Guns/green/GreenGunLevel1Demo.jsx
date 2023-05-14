import React from "react";
import { View } from "react-native";

export default function GreenGunLevel1Demo({ size }) {
  const renderLazer = () => {
    return (
      <View
        style={{
          borderWidth: size * 0.04,
          borderColor: "#6DF826",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          borderBottomLeftRadius: "100%",
        }}
      ></View>
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
      <View
        style={{
          width: size,
          aspectRatio: 1,
          borderRadius: "100%",
          borderColor: "#6DF826",
          borderWidth: size * 0.05,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: size,
            gap: -size * 0.05,
            right: -size * 0.2,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            height: size * 0.2,
          }}
        >
          {renderLazer()}
        </View>
      </View>
    </View>
  );
}
