import React from "react";
import { View } from "react-native";

export default function WhiteGunLevel1Demo({ size }) {
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
          borderColor: "white",
          borderWidth: size * 0.05,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: size * 0.6,
            aspectRatio: 1,
            borderRadius: "100%",
            borderColor: "white",
            borderWidth: size * 0.05,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            elevation: 1,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            width: size * 0.6,
            right: -size * 0.2,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              borderWidth: size * 0.04,
              borderColor: "white",
              height: size * 0.25,
            }}
          ></View>
        </View>
      </View>
    </View>
  );
}
