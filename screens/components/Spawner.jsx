import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Square, { renderSquare } from "./Entities/Square";
import { FieldContext } from "./../../utils/fieldContext";
import { getCoordinatedPath } from "../../game_logic/pathfinding/findPath";

const Spawner = React.forwardRef(
  ({ size, coords, addEntity, removeEntity }, ref) => {
    const entitySpawnRef = useRef(0);
    const [entityArray, setEntityArray] = useState([]);
    const { field } = useContext(FieldContext);
    const pathRef = useRef([]);
    const planPathRef = useRef(getCoordinatedPath(field, coords, [8, 20]));

    useImperativeHandle(ref, () => ({
      calculatePath: (newField, doubled, actionType) => {
        if (
          !pathRef.current.some(
            (cur) => cur[0] === doubled[0] && cur[1] === doubled[1]
          ) &&
          !actionType
        ) {
          planPathRef.current = pathRef.current;
          return true;
        } else {
          const path = getCoordinatedPath(newField, coords, [8, 20]);
          if (path) planPathRef.current = path;
          return Boolean(path);
        }
      },
    }));

    useEffect(() => {
      setInterval(() => {
        pathRef.current &&
          setEntityArray((entities) => {
            if (entitySpawnRef.current < 10)
              return [...entities, entitySpawnRef.current++];
            if (entities.length === 0) {
              entitySpawnRef.current = 0;
            }
            return entities;
          });
      }, 1000);
    }, []);

    useEffect(() => {
      if (field) pathRef.current = planPathRef.current;
    }, [field]);

    return (
      <>
        {renderSquare()}
        {entityArray.map((i) => (
          <Square
            key={i}
            ref={(ref) => addEntity(ref, `${i}`)}
            coords={coords}
            size={size}
            instructionRef={pathRef}
            destroySelf={() => {
              setEntityArray((entities) =>
                entities.filter((index) => index !== i)
              );
              removeEntity(`${i}`);
            }}
          />
        ))}
      </>
    );
  }
);

export default Spawner;
