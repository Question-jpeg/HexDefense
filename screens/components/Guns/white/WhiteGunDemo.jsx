import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";

export default function WhiteGunDemo({ level, size }) {
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
        {level > 2 && (
          <>
            <View
              style={{
                backgroundColor: "black",
                position: "absolute",
                transform: [{ rotate: "30deg" }, { translateX: -size * 0.45 }],
                borderWidth: size * 0.04,
                width: size * 0.25,
                aspectRatio: 1,
                borderColor: "white",
                zIndex: 2,
                elevation: 2,
              }}
            ></View>
            <View
              style={{
                backgroundColor: "black",
                position: "absolute",
                transform: [{ rotate: "-30deg" }, { translateX: -size * 0.45 }],
                borderWidth: size * 0.04,
                width: size * 0.25,
                aspectRatio: 1,
                borderColor: "white",
                zIndex: 2,
                elevation: 2,
              }}
            ></View>
          </>
        )}
        <View
          style={{
            width: size * 0.6,
            aspectRatio: 1,
            borderRadius: "100%",
            borderColor: "white",
            borderWidth: size * 0.05,
            backgroundColor: "black",
            marginRight: level > 1 ? size * 0.15 : 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            elevation: 1,
          }}
        >
          {level === 4 && (
            <FontAwesome name="superpowers" size={size * 0.3} color="white" />
          )}
        </View>
        <View
          style={{
            position: "absolute",
            width: level < 2 ? size * 0.6 : size * 0.9,
            gap: level > 2 ? -size * 0.1 : -size * 0.05,
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
          {level > 1 && (
            <View
              style={{
                borderWidth: size * 0.04,
                borderColor: "white",
                height: size * 0.25,
              }}
            ></View>
          )}
          {level > 2 && (
            <View
              style={{
                borderWidth: size * 0.04,
                borderColor: "white",
                height: size * 0.25,
              }}
            ></View>
          )}
        </View>
      </View>
    </View>
  );
}
