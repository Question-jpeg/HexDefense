import React, { useImperativeHandle, useState } from "react";
import * as Progress from "react-native-progress";
import { useRef } from "react";

const ProgressPie = React.forwardRef(({ size }, ref) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();

  useImperativeHandle(ref, () => ({
    animate: (callback) => {
      intervalRef.current = setInterval(() => {
        setProgress((value) => {
          if (value < 1) return value + 0.02;
          clearInterval(intervalRef.current);
          callback();
          return 0;
        });
      }, 100);
    },
  }));

  return (
    progress > 0 && (
      <Progress.Pie
        animated={false}
        style={{ position: "absolute", opacity: 0.75 }}
        progress={progress}
        size={size*0.9}
        color="lightgrey"
        borderWidth={0}
      />
    )
  );
});

export default ProgressPie;
