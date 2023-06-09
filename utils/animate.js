import { Animated, Easing } from "react-native";

export const animate = (animatedValue, config, callback = () => {}) => {
  if (config["useNativeDriver"] !== false) config["useNativeDriver"] = true;
  if (!config["easing"]) config["easing"] = Easing.bezier(0.14, 0.51, 0.26, 1);
  Animated.timing(animatedValue, config).start(callback);
};
