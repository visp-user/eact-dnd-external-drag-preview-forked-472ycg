import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableBox } from "./DraggableBox";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { NativeTypes } from "react-dnd-html5-backend";
const styles = {
  width: 300,
  height: 300,
  border: "1px solid black",
  position: "relative"
};
export const Container = ({ snapToGrid }) => {
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 80, title: "Drag me around" },
    b: { top: 180, left: 20, title: "Drag me too" }
  });
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top }
          }
        })
      );
    },
    [boxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.BOX, NativeTypes.HTML],
      hover() {
        console.log("hovering");
      },
      drop(item, monitor) {
        console.log("dropping");
        if (item.id) {
          const delta = monitor.getDifferenceFromInitialOffset();
          let left = Math.round(item.left + delta.x);
          let top = Math.round(item.top + delta.y);
          if (snapToGrid) {
            [left, top] = doSnapToGrid(left, top);
          }
          moveBox(item.id, left, top);
          return undefined;
        }
      }
    }),
    [moveBox]
  );
  return (
    <>
      <div ref={drop} style={styles}>
        {Object.keys(boxes).map((key) => (
          <DraggableBox key={key} id={key} {...boxes[key]} />
        ))}

        <div>hey some plain HTML</div>
      </div>
    </>
  );
};
