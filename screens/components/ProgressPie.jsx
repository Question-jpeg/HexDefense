import React, { useImperativeHandle, useState } from "react";
import * as Progress from "react-native-progress";
import { useRef, useEffect } from "react";

const ProgressPie = React.forwardRef(({ size }, ref) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();
  const callbackRef = useRef();

  useImperativeHandle(ref, () => ({
    animate: (callback) => {
      callbackRef.current = callback;

      intervalRef.current = setInterval(() => {
        setProgress((value) => {
          if (value < 1) return value + 0.02;
          clearInterval(intervalRef.current);
          return 0;
        });
      }, 100);
    },
  }));

  useEffect(() => {
    if (progress === 0 && callbackRef.current) callbackRef.current();
  }, [progress]);

  return (
    progress > 0 && (
      <Progress.Pie
        animated={false}
        style={{ position: "absolute", opacity: 0.75 }}
        progress={progress}
        size={size * 0.9}
        color="lightgrey"
        borderWidth={0}
      />
    )
  );
});

ProgressPie.displayName = "ProgressPie";

export default ProgressPie;
