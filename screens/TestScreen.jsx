import React, { useState, useRef, useEffect } from "react";
import { Animated, Easing, View } from "react-native";
import { FieldContext } from "./../utils/fieldContext";
import BlueGun from "./components/Guns/blue/BlueGun";
import GreenGun from "./components/Guns/green/GreenGun";
import RedGun from "./components/Guns/red/RedGun";
import Rocket from "./components/Guns/red/Rocket";
import WhiteGun from "./components/Guns/white/WhiteGun";
import { BlurView } from "expo-blur";
import { animate } from "./../utils/animate";
import BlueGunDemo from "./components/Guns/blue/BlueGunDemo";
import GreenGunDemo from "./components/Guns/green/GreenGunDemo";
import RedGunDemo from "./components/Guns/red/RedGunDemo";
import WhiteGunDemo from "./components/Guns/white/WhiteGunDemo";

export default function TestScreen() {
  const [touchedCoords, setTouchedCoords] = useState();

  const boomAnimatedValue = useRef(new Animated.Value(0)).current;

  const touchedCoordsRef = useRef();
  touchedCoordsRef.current = touchedCoords;

  const entitiesRef = useRef([]);

  const level = 4;
  const size = 100;

  // const [visibility, setVisibility] = useState(0);
  // useEffect(() => {
  //   setInterval(() => {
  //     setVisibility((vis) => vis + 1);
  //     console.log();
  //   }, 3000);
  // }, []);

  return (
    <FieldContext.Provider value={{ entitiesRef, touchedCoordsRef }}>
      <View
        onTouchStart={({ nativeEvent: { pageX: x, pageY: y } }) => {
          setTouchedCoords({ x, y });
          animate(boomAnimatedValue, { toValue: 1, duration: 500 }, () =>
            boomAnimatedValue.setValue(0)
          );
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
        {/* {[
          <WhiteGun key={0} level={level} size={size} />,
          <GreenGun key={1} level={level} size={size} />,
          <RedGun key={2} level={level} size={size} />,
          <BlueGun key={3} level={level} size={size} />,
        ].slice(visibility)} */}
        {/* <View
          style={{
            width: 50,
            aspectRatio: 1,
            backgroundColor: "orange",
            transform: [{ translateX: 50 }, { translateY: 100 }],
          }}
        ></View> */}
        <View
          style={{
            height: size * 0.7,
            borderLeftWidth: size,
            borderBottomWidth: size * 0.3,
            borderTopWidth: size * 0.3,
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
            borderLeftColor: "orange",
            borderRadius: "100%",
            position: "absolute",
            shadowOpacity: 1,
            shadowOffset: {width: 0, height: 0},
            shadowColor: 'orange',
            shadowRadius: 10
          }}
        >
        </View>
        {/* <BlueGunDemo level={level} size={size} />
        <GreenGunDemo level={level} size={size} />
        <RedGunDemo level={level} size={size} />
        <WhiteGunDemo level={level} size={size} /> */}
        {/* <BlurView style={{width: 100, aspectRatio: 1, backgroundColor: 'white', borderRadius: '100%'}} tint={'dark'} intensity={20} />
        <RedGun level={level} size={size*0.8} cellSize={size} />
        <WhiteGun level={level} size={size*0.8} cellSize={size} />
        <GreenGun level={level} size={size*0.8} cellSize={size} />
        <BlueGun level={level} size={size*0.8} cellSize={size} /> */}
      </View>
    </FieldContext.Provider>
  );
}
