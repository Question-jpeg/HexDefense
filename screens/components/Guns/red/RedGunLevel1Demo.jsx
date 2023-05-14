import React from "react";
import { View } from "react-native";

export default function RedGunLevel1Demo({ size }) {
  const renderGunPount = () => (
    <View
      style={{
        borderWidth: size * 0.04,
        width: size * 1.1,
        height: size / 3,
        borderColor: "red",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        gap: size * 0.07,
        paddingRight: size * 0.1,
      }}
    >
      {[1, 2, 3].map((key) => (
        <View
          key={key}
          style={{
            width: size * 0.03,
            height: "50%",
            backgroundColor: "red",
            transform: [{ rotate: "15deg" }],
          }}
        ></View>
      ))}
    </View>
  );

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
          borderColor: "red",
          borderWidth: size * 0.05,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderGunPount()}
        <View
          style={{
            borderWidth: size * 0.04,
            width: size / 2,
            height: size / 4,
            borderColor: "red",
            marginBottom: size * 0.2,
            backgroundColor: "black",
          }}
        ></View>
      </View>
    </View>
  );
}
