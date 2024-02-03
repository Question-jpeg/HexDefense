import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";

import BlueGunDemo from "./Guns/blue/BlueGunDemo";

import GreenGunDemo from "./Guns/green/GreenGunDemo";

import RedGunDemo from "./Guns/red/RedGunDemo";

import WhiteGunDemo from "./Guns/white/WhiteGunDemo";

import { animate } from "./../../utils/animate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GunsInfo from "../../config/GunsInfo";

const config = {
  wg: {
    borderColor: "white",
    render: (level) => <WhiteGunDemo level={level} size={45} />,
  },
  gg: {
    borderColor: "#6DF826",
    render: (level) => <GreenGunDemo level={level} size={45} />,
  },
  rg: {
    borderColor: "red",
    render: (level) => <RedGunDemo level={level} size={45} />,
  },
  bg: {
    borderColor: "#68C3FB",
    render: (level) => <BlueGunDemo level={level} size={45} />,
  },
};

const GunChoicer = React.forwardRef(
  ({ selectionRef, removeGun, upgradeGun, selectedGunRef }, ref) => {
    const initialMoney = 999;
    const moneyRef = useRef(initialMoney);
    const [moneyValue, setMoneyValue] = useState(initialMoney);
    const displayingMoney = useRef(initialMoney);

    const [selection, setSelection] = useState();
    const [selectedGunData, setSelectedGunData] = useState();
    const [upgradingGuns, setUpgradingGuns] = useState([]);

    const isUpgrading =
      selectedGunRef.current &&
      upgradingGuns.some(
        (coords) =>
          coords.row === selectedGunRef.current.row &&
          coords.col === selectedGunRef.current.col
      );

    const switchAnimatedValue = useRef(new Animated.Value(0)).current;
    const moneyOpacityAnimatedValue = useRef(new Animated.Value(0)).current;
    const moneyIntervalRef = useRef();

    const animateUnavailability = () => {
      animate(
        moneyOpacityAnimatedValue,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        },
        () => {
          moneyOpacityAnimatedValue.setValue(0);
        }
      );
    };

    const setSelectedGun = (gunType, coords = null) => {
      selectedGunRef.current = coords;

      let toValue = 0;
      if (gunType) {
        const [selectedGunKey, selectedGunLevel] = gunType.split("_");
        setSelectedGunData({
          key: selectedGunKey,
          level: Number.parseInt(selectedGunLevel),
        });
        toValue = 1;
      }
      animate(switchAnimatedValue, { toValue, duration: 1000 });
    };

    useImperativeHandle(ref, () => ({
      setSelectedGun,
      isAvailable: () => {
        if (GunsInfo[`${selectionRef.current}g`].costs[0] > moneyRef.current) {
          animateUnavailability();
          return false;
        }
        return true;
      },
      addMoney: (quantity) => {
        moneyRef.current += quantity;

        clearInterval(moneyIntervalRef.current);

        moneyIntervalRef.current = setInterval(() => {
          setMoneyValue((value) => {
            if (value === moneyRef.current) {
              clearInterval(moneyIntervalRef.current);
              return value;
            }
            if (value > moneyRef.current) {
              displayingMoney.current--;
              return value - 1;
            }
            displayingMoney.current++;
            return value + 1;
          });
        }, 1000 / (Math.abs(displayingMoney.current - moneyRef.current) ?? 1));
      },
      addUpgrading: (coords) => {
        setUpgradingGuns((guns) => [...guns, coords]);
      },
      removeUpgrading: (coords, type) => {
        if (
          selectedGunRef.current &&
          selectedGunRef.current.row === coords.row &&
          selectedGunRef.current.col === coords.col
        )
          setSelectedGun(type, selectedGunRef.current);
        setUpgradingGuns((guns) =>
          guns.filter(
            (gun) => !(gun.row === coords.row && gun.col === coords.col)
          )
        );
      },
    }));

    const wrapInBox = (key, component, borderColor, selectionKey) => {
      const cost = GunsInfo[`${selectionKey}g`].costs[0];
      return (
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
    };

    return (
      <View
        style={{
          backgroundColor: "#181a1c",
          width: "100%",
          paddingBottom: 20,
        }}
      >
        <Animated.Text
          style={{
            opacity: moneyOpacityAnimatedValue.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [1, 0.2, 1, 0.2, 1],
            }),
            color: moneyOpacityAnimatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ["white", "red", "white"],
            }),
            fontSize: 20,
            fontWeight: "bold",
            position: "absolute",
            top: -35,
            right: 20,
            alignSelf: "flex-end",
          }}
        >
          ${moneyValue}
        </Animated.Text>

        <View style={{ overflow: "hidden" }}>
          <Animated.View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 25,

              transform: [
                {
                  translateY: switchAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
                {
                  scale: switchAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.8],
                  }),
                },
              ],
            }}
          >
            {[
              {
                component: <WhiteGunDemo level={1} size={35} />,
                borderColor: "white",
                selectionKey: "w",
              },
              {
                component: <GreenGunDemo level={1} size={35} />,
                borderColor: "#6DF826",
                selectionKey: "g",
              },
              {
                component: <RedGunDemo level={1} size={35} />,
                borderColor: "red",
                selectionKey: "r",
              },
              {
                component: <BlueGunDemo level={1} size={35} />,
                borderColor: "#68C3FB",
                selectionKey: "b",
              },
            ].map(({ component, borderColor, selectionKey }, index) =>
              wrapInBox(index, component, borderColor, selectionKey)
            )}
          </Animated.View>
          {selectedGunData && (
            <Animated.View
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                transform: [
                  {
                    translateY: switchAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                  {
                    scale: switchAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={removeGun}
                disabled={isUpgrading}
                style={{
                  minWidth: 70,
                  paddingVertical: 5,
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: isUpgrading ? 0.3 : 1,
                }}
              >
                <MaterialCommunityIcons name="close" size={28} color="white" />
                <Text
                  style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                >
                  $
                  {
                    GunsInfo[selectedGunData.key].sells[
                      selectedGunData.level - 1
                    ]
                  }
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  padding: 12.5,
                  borderWidth: 2,
                  borderColor: config[selectedGunData.key]["borderColor"],
                  borderRadius: 15,
                }}
              >
                {config[selectedGunData.key]["render"](
                  Number.parseInt(selectedGunData.level)
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  GunsInfo[selectedGunData.key].costs[selectedGunData.level] >
                  moneyRef.current
                    ? animateUnavailability()
                    : upgradeGun();
                }}
                disabled={selectedGunData.level === 4 || isUpgrading}
                style={{
                  minWidth: 70,
                  paddingVertical: 5,
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: selectedGunData.level === 4 || isUpgrading ? 0.3 : 1,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-up-bold"
                  size={28}
                  color="white"
                />
                <Text
                  style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                >
                  {selectedGunData.level === 4
                    ? "Max"
                    : `$${
                        GunsInfo[selectedGunData.key].costs[
                          selectedGunData.level
                        ]
                      }`}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }
);

GunChoicer.displayName = "GunChoicer";

export default GunChoicer;
