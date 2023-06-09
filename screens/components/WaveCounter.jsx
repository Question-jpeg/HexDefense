import React, { useImperativeHandle, useRef } from "react";
import { Text } from "react-native";
import { useState } from "react";

const WaveCounter = React.forwardRef(({}, ref) => {
  const waveCountRef = useRef(1);
  const [waveCount, setWaveCount] = useState(1);
  useImperativeHandle(ref, () => ({
    incrementWaveCount: () =>
      setWaveCount((count) => {
        waveCountRef.current = count + 1;
        return count + 1;
      }),
    getWaveCount: () => waveCountRef.current,
  }));
  return (
    <Text
      style={{
        fontSize: 20,
        color: "white",
        alignSelf: "center",
        marginBottom: 25,
        fontWeight: '500'
      }}
    >
      Волна {waveCount}
    </Text>
  );
});

export default WaveCounter;
