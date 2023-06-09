import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function GreenGunDemo({ level, size }) {
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

      </View>
    );
  };

  const renderTrapezoid = () => {
    return (
      <Feather
        name="triangle"
        size={size*0.8}
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
          gap: size * 0.1,
        }}
      >
        <View
          style={{
            width: size,
            gap: level === 4 ? -size * 0.3 : -size*0.05,
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
      </View>
    </View>
  );
}
