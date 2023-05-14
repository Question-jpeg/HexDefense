import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BlueGunLevel1Demo from "./Guns/blue/BlueGunLevel1Demo";
import GreenGunLevel1Demo from "./Guns/green/GreenGunLevel1Demo";
import RedGunLevel1Demo from "./Guns/red/RedGunLevel1Demo";
import WhiteGunLevel1Demo from "./Guns/white/WhiteGunLevel1Demo";
import { FieldContext } from "./../../utils/fieldContext";

export default function GunChoicer() {
  const [selection, setSelection] = useState();

  const { selectionRef } = useContext(FieldContext);

  const wrapInBox = (key, component, borderColor, cost, selectionKey) => (
    <TouchableOpacity
      onPress={() => {
        setSelection(selectionKey);
        selectionRef.current = selectionKey;
      }}
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        opacity: selectionKey === selection ? 0.3 : 1,
      }}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor,
          borderRadius: 10,
          padding: 10,
        }}
      >
        {component}
      </View>
      <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
        {`$${cost}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: "#181a1c",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 25,
        paddingBottom: 20,
      }}
    >
      {[
        {
          component: <WhiteGunLevel1Demo size={35} />,
          cost: 15,
          borderColor: "white",
          selectionKey: "w",
        },
        {
          component: <GreenGunLevel1Demo size={35} />,
          cost: 25,
          borderColor: "#6DF826",
          selectionKey: "g",
        },
        {
          component: <RedGunLevel1Demo size={35} />,
          cost: 30,
          borderColor: "red",
          selectionKey: "r",
        },
        {
          component: <BlueGunLevel1Demo size={35} />,
          cost: 50,
          borderColor: "#68C3FB",
          selectionKey: "b",
        },
      ].map(({ component, borderColor, cost, selectionKey }, index) =>
        wrapInBox(index, component, borderColor, cost, selectionKey)
      )}
    </View>
  );
}
