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
    const { fieldRef, waveCounterRef } = useContext(FieldContext);
    const pathRef = useRef(
      getCoordinatedPath(fieldRef.current, coords, [8, 20])
    );
    const planPathRef = useRef();
    const spawnIntervalRef = useRef();

    const startSpawn = () => {
      spawnIntervalRef.current = setInterval(() => {
        pathRef.current &&
          setEntityArray((entities) => {
            if (entitySpawnRef.current < 10)
              return [...entities, entitySpawnRef.current++];

            clearInterval(spawnIntervalRef.current);
            entitySpawnRef.current = 0;

            return entities;
          });
      }, 1000);
    }

    useImperativeHandle(ref, () => ({
      calculatePath: (newField, doubled, walkable) => {
        if (
          !pathRef.current.some(
            (cur) => cur[0] === doubled[0] && cur[1] === doubled[1]
          ) &&
          !walkable
        ) {
          planPathRef.current = pathRef.current;
          return true;
        } else {
          const path = getCoordinatedPath(newField, coords, [8, 20]);
          if (path) planPathRef.current = path;
          return Boolean(path);
        }
      },
      applyPath: () => {
        pathRef.current = planPathRef.current;
      },
      startSpawn,
    }));

    useEffect(() => {
      if (entityArray.length == 0 && entitySpawnRef.current == 0) {
        waveCounterRef.current.incrementWaveCount()
        startSpawn()        
      }
    }, [entityArray])

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
              removeEntity(`${i}`);
              setEntityArray((entities) =>
                entities.filter((index) => index !== i)
              );
            }}
          />
        ))}
      </>
    );
  }
);

Spawner.displayName = 'Spawner'

export default Spawner;
