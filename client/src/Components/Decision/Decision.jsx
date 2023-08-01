import React, { useState } from "react";
import "./Decision.css"; // Import your Decision.css file here

const Decision = () => {
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    const randomRotation = Math.ceil(Math.random() * 1000);
    setRotation((prevRotation) => prevRotation + randomRotation);
  };

  return (
    <div className="decision">
      <div className="decision-wrapper">
        <button id="spin" onClick={handleSpin}>
          Spin
        </button>
        <span className="arrow"></span>
        <div className="container" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="one">1</div>
          <div className="two">2</div>
          <div className="three">3</div>
          <div className="four">4</div>
          <div className="five">5</div>
          <div className="six">6</div>
          <div className="seven">7</div>
          <div className="eight">8</div>
        </div>
      </div>
    </div>
  );
};

export default Decision;
