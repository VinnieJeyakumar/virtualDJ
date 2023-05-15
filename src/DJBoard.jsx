import React, { useState } from "react";
import "./DJBoard.css";

function DJBoard() {
  const [leftButtonActive, setLeftButtonActive] = useState(false);
  const [rightButtonActive, setRightButtonActive] = useState(false);

  const toggleButton = (side) => {
    if (side === "left") {
      setLeftButtonActive(!leftButtonActive);
    } else if (side === "right") {
      setRightButtonActive(!rightButtonActive);
    }
  };

  return (
    <div className="dj-board">
        <div className="buttons">
            <button
                className={`toggle-button ${leftButtonActive ? "active" : ""}`}
                onClick={() => toggleButton("left")}
            ></button>
            <button
                className={`toggle-button ${rightButtonActive ? "active" : ""}`}
                onClick={() => toggleButton("right")}
            ></button>
        </div>
        <div className="wheel"></div>
        <div className="drum-pad">
            {[...Array(6)].map((_, i) => (
            <button key={i} className={`pad pad-${i + 1}`}></button>
            ))}
        </div>
        <div className="knobs">
            <div className="knob"></div>
            <div className="knob"></div>
            <div className="knob"></div>
        </div>
        <div className="sliders">
            <div className="slider"></div>
            <div className="slider"></div>
        </div>
    </div>
  );
}

export default DJBoard;
