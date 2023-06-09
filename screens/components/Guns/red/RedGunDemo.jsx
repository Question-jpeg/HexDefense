import React from "react";
import { View } from "react-native";

export default function RedGunDemo({ level, size }) {
  const renderGunPount = (index) => (
    <View
      style={{
        borderWidth: size * 0.04,
        width: level === 1 ? size * 1.1 : level === 4 ? size * 0.9 : size,
        height: level === 1 ? size / 3 : level === 4 ? size * 0.3 : size / 3.25,
        borderColor: "red",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: index === 1 ? "flex-start" : "flex-end",
        gap: size * 0.07,
        paddingRight: size * 0.1,
        marginLeft: level === 2 ? size * 0.1 : level === 4 ? size * 0.3 : 0,
        borderBottomLeftRadius: level === 1 ? 0 : "100%",
        borderTopLeftRadius: level === 1 ? 0 : "100%",
        transform: [
          {
            rotate:
              level === 4
                ? index === 1
                  ? "-30deg"
                  : index === 3
                  ? "30deg"
                  : "0deg"
                : "0deg",
          },
        ],
        zIndex: index === 2 ? 5 : 0,
        elevation: index === 2 ? 5 : 0,
      }}
    >
      {[1, 2, 3, level === 4 ? 4 : null]
        .filter((key) => key)
        .map((key) => (
          <View
            key={key}
            style={{
              width: size * 0.03,
              height: "50%",
              backgroundColor: "red",
              transform: [{ rotate: index === 1 ? "15deg" : "-15deg" }],
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
        {level === 1 ? (
          <>
            {renderGunPount(1)}
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
          </>
        ) : level === 2 ? (
          <>
            {renderGunPount(1)}
            {renderGunPount(2)}
          </>
        ) : level === 3 ? (
          <>
            <View
              style={{
                borderWidth: size * 0.04,
                width: size * 0.5,
                height: size * 0.2,
                borderColor: "red",
                backgroundColor: "black",
                marginRight: size * 0.2,
              }}
            ></View>
            {renderGunPount(1)}
            {renderGunPount(2)}
            <View
              style={{
                borderWidth: size * 0.04,
                width: size * 0.5,
                height: size * 0.2,
                borderColor: "red",
                backgroundColor: "black",
                marginRight: size * 0.2,
              }}
            ></View>
          </>
        ) : (
          <>
            {renderGunPount(1)}
            {renderGunPount(2)}
            {renderGunPount(3)}
            <View
              style={{
                position: "absolute",
                aspectRatio: 1,
                width: size * 0.6,
                borderColor: "red",
                borderWidth: size * 0.05,
                borderRadius: "100%",
                left: 0,
                backgroundColor: "black",
              }}
            ></View>
          </>
        )}
      </View>
    </View>
  );
}
