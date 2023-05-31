import React, { useState } from "react";
import { Knob } from 'primereact/knob';
import { Slider } from 'primereact/slider';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./DJBoard.css";

function DJBoard() {
  const [leftButtonActive, setLeftButtonActive] = useState(false);
  const [rightButtonActive, setRightButtonActive] = useState(false);
  const [knobValue, setKnobValue] = useState([50, 50, 50]);
  const [sliderValue, setSliderValue] = useState([50, 50]);

  const toggleButton = (side) => {
    if (side === "left") {
      setLeftButtonActive(!leftButtonActive);
    } else if (side === "right") {
      setRightButtonActive(!rightButtonActive);
    }
  };

  const changeSlider = (index, e) => {
    let newSliderValue = [...sliderValue];
    newSliderValue[index] = e.value;
    setSliderValue(newSliderValue);
  };

  const calculatePlaybackSpeed = (value) => {
    if (value <= 50) {
      return 0.25 + (value / 50) * 0.75;
    } else {
      return 1 + ((value - 50) / 50) * 1;
    }
  }

  return (
    <div className="dj-board">
      <div className="left-section">
        <div className="buttons">
          <button
            className={`toggle-button ${leftButtonActive ? "active" : ""}`}
            onClick={() => toggleButton("left")}
          >
            {leftButtonActive ? "Playback" : "Scratch"}
          </button>
          <button
            className={`toggle-button ${rightButtonActive ? "active" : ""}`}
            onClick={() => toggleButton("right")}
          >
            {rightButtonActive ? "AI DJ" : "Manual"}
          </button>
        </div>
        <div className={`wheel ${leftButtonActive ? "stop-spinning" : ""}`}></div>
        <div className="drum-pad">
          {[...Array(6)].map((_, i) => (
            <button key={i} className={`pad pad-${i + 1}`}></button>
          ))}
        </div>
      </div>
      <div className="right-section">
        <div className="sliders">
          <div className="slider-wrap">
            <Slider 
              value={sliderValue[0]}
              onChange={e => changeSlider(0, e)}
              orientation="vertical"
              min={0}
              max={100}
            />
            <label className="volume-label">Volume: {Math.round(sliderValue[0])}</label>
          </div>
          <div className="slider-wrap">
            <Slider 
              value={sliderValue[1]}
              onChange={e => changeSlider(1, e)}
              orientation="vertical"
              min={0}
              max={100}
            />
            <label className="playback-label">Playback Speed: {calculatePlaybackSpeed(sliderValue[1]).toFixed(2)}</label>
          </div>
        </div>
        <div className="knobs">
          {['Treble', 'Mid', 'Bass'].map((label, i) => (
            <div className="knob-wrap" key={i}>
              <Knob 
                value={knobValue[i]} 
                onChange={(e) => {
                  let newKnobValue = [...knobValue];
                  newKnobValue[i] = e.value;
                  setKnobValue(newKnobValue);
                }}
                size={130}
                min={0}
                max={100}
                step={1}
                strokeWidth={15}
                valueColor="#1895d1"
                rangeColor="#c53055"
                textColor="#fff"
              />
              <label className="knob-label">{label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DJBoard;
