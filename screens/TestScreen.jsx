import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { FieldContext } from "./../utils/fieldContext";

export default function TestScreen() {
  const [touchedCoords, setTouchedCoords] = useState();

  const centerRef = useRef();

  useEffect(() => {
    if (touchedCoords) {
      const target = { x: touchedCoords.x, y: touchedCoords.y };
      centerRef.current.measure((fx, fy, width, height, px, py) => {
        const y = py
        const x = px

        const coef = (target.y - y) / (target.x - x);
        const angle = Math.atan(coef) + (target.x < x ? Math.PI : 0);
        console.log(angle);
      });
    }
  }, [touchedCoords]);

  return (
    // <FieldContext.Provider value={{ entitiesRef, touchedCoordsRef }}>
    <View
      onTouchStart={({ nativeEvent: { pageX: x, pageY: y } }) => {
        setTouchedCoords({ x, y });
      }}
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <View
        ref={centerRef}
        style={{
          backgroundColor: "yellow",
          borderRadius: "100%",
          width: 20,
          height: 20,
        }}
      ></View>
    </View>
    // </FieldContext.Provider>
  );
}
