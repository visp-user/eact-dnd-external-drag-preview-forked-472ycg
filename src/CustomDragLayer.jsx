import { useDragLayer } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { BoxDragPreview } from "./BoxDragPreview";
import { snapToGrid } from "./snapToGrid";
import { NativeTypes } from "react-dnd-html5-backend";
const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
  // backgroundColor: "lightblue",
  // opacity: 0.5
};
const styles = {
  display: "inline-block",
  backgroundColor: "white",
  borderColor: "black",
  borderWidth: "1px",
  borderStyle: "solid"
};
const getSelectedText = () => {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.selection) {
    return document.selection.createRange().text;
  }
  return "";
};
export const CustomDragLayer = (props) => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
    clientOffset
  } = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset()
    };
  });
  function renderItem(clientOffset, currentOffset) {
    switch (itemType) {
      case ItemTypes.BOX:
        return <BoxDragPreview title={item.title} />;
      case NativeTypes.HTML:
        //console.log("CRAIG - looks like HTML to me");
        if (!clientOffset) {
          return null;
        }
        let { x, y } = clientOffset;
        return (
          <div style={styles}>
            x: {x}, y: {y} {getSelectedText()}
          </div>
        );
      default:
        return null;
    }
  }
  function getItemStyles(
    clientOffset,
    initialOffset,
    currentOffset,
    isSnapToGrid
  ) {
    if (itemType === NativeTypes.HTML) {
      if (!clientOffset) {
        return { display: "none" };
      }
      let { x, y } = clientOffset;
      const transform = `translate(${x}px, ${y}px)`;
      return {
        transform,
        WebkitTransform: transform
      };
    } else if (itemType === ItemTypes.BOX) {
      if (!initialOffset || !currentOffset) {
        return {
          display: "none"
        };
      }
      let { x, y } = currentOffset;
      if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;
      }
      const transform = `translate(${x}px, ${y}px)`;
      return {
        transform,
        WebkitTransform: transform
      };
    }
  }
  //console.log("CRAIG - drag layer is watching");
  if (!isDragging) {
    return null;
  }
  return (
    <>
      <div style={layerStyles}>
        <div
          style={getItemStyles(
            clientOffset,
            initialOffset,
            currentOffset,
            props.snapToGrid
          )}
        >
          {renderItem(clientOffset, currentOffset)}
        </div>
      </div>
    </>
  );
};
