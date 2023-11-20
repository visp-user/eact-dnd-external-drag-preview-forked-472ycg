import { render } from "react-dom";
import Example from "./example";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.css";
import "./jquery-global.js";
import "./jquery-ui-global.js";

function App() {
  const getSelectedText = () => {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection) {
      return document.selection.createRange().text;
    }
    return "";
  };
  const dragStartHandler = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    if (document.getElementById("co_document").contains(e.target)) {
      var drag_icon = document.getElementById("drag_icon");
      //drag_icon.innerHTML = "&nbsp;";
      e.dataTransfer.setDragImage(drag_icon, 0, 0);
    }
  };
  return (
    <>
      <div>
        <div id="co_document" onDragStart={dragStartHandler}>
          <strong>
            <i>
              {" "}
              If you select this text and drag it, our React app below is
              controlling the shadow copy.
            </i>
          </strong>
          <br />
          This emulates copying text from the document (outside of the ROB/React
          app)
          <a href="javascript:void(0)" className="jqdrag">
            jQuery link (custom shadow copy)
          </a>
          <div>
            {" "}
            <a href="javascript:void(0)">
              this is a normal link (no jquery wrapping)
            </a>
          </div>
        </div>
        <div style={{ border: "2px solid blue", marginTop: "35px" }}>
          <div className="App">
            <div>Some text inside the React App</div>
            <p>&nbsp;</p>
            <div style={{ border: "2px solid yellow" }}>
              <DndProvider backend={HTML5Backend}>
                <div>Some text inside the DnD provider</div>
                <p>&nbsp;</p>
                <Example />
              </DndProvider>
            </div>
          </div>
        </div>
      </div>
      <div id="drag_icon" className="dragimage">
        &nbsp;
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

jQuery(".jqdrag").draggable({
  helper: function () {
    //debugger;
    return $(
      '<div style="background-color:white; border: 1px solid black; width: 300px; height: 100px">jquery shadow copy</div>'
    );
  }
});
