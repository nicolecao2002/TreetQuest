// Decision.jsx
import "./Decision.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Decision = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [segmentData, setSegmentData] = useState([]);

  useEffect(() => {
    // Fetch segment data from the backend API
    const userId = getCookie("ID");
    axios
      .get(`http://localhost:3002/decision`, { params: { userId } })
      .then((response) => {
        const rewardNames = response.data.map((item) => item.reward_name);
        setSegmentData(rewardNames);
      });
  }, []);

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * segmentData.length);
      setResult(segmentData[randomIndex]);
      setSpinning(false);
    }, 5000);
  };

  const getCookie = (name) => {
    // Replace with your cookie reading logic
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div className="decision">
      <h1>Decision Wheel</h1>
      <div className={`decision-wrapper ${spinning ? "spin" : ""}`}>
        <div className={`spin_container ${spinning ? "spin" : ""}`}>
          {segmentData.map((segment, index) => (
            <div
              key={index}
              className={`segment segment-${index + 1}`}
              style={{
                backgroundColor: getRandomColor(),
                transform: `rotate(${(360 / segmentData.length) * index}deg)`,
              }}
            >
              {segment}
            </div>
          ))}
          <div className="arrow"></div>
        </div>
        <button id="spin" onClick={handleSpin}>
          Spin
        </button>
      </div>
    </div>
  );
};

export default Decision;
