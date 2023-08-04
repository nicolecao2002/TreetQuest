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
      })
      .catch((error) => {
        console.error("Error fetching segment data:", error);
      });
  }, []);

  const handleSpin = () => {
    if (spinning) return; // Prevent spinning if already spinning

    setSpinning(true);

    // Random number of rotations (between 3 and 6)
    const rotations = 3 + Math.floor(Math.random() * 4);

    // Rotate for the specified number of rotations
    const totalRotation = 360 * rotations;
    const randomIndex = Math.floor(Math.random() * segmentData.length);
    const segmentAngle = 360 / segmentData.length;
    const resultAngle = totalRotation + (segmentData.length - randomIndex - 1) * segmentAngle;

    setTimeout(() => {
      setResult(segmentData[randomIndex]);
      setSpinning(false);
    }, 5000 + totalRotation); // Wait for 5000ms + totalRotation before stopping the spinning
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

  const colors = Array.from({ length: segmentData.length }, () => getRandomColor());

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
                backgroundColor: colors[index],
                transform: `rotate(${(360 / segmentData.length) * index}deg)`,
              }}
            ></div>
          ))}
        </div>
        <button id="spin" onClick={handleSpin}>
          Spin
        </button>
      </div>
      <div className="reward-names">
        <h2 className="reward_title">Potential Reward</h2>
        {segmentData.map((segment, index) => (
          <div key={index} className="reward-name" style={{ color: colors[index] }}>
            {segment}
          </div>
        ))}
      </div>
      {result && (
        <div
          className="result-segment"
          style={{ color: colors[segmentData.indexOf(result)] }}
        >
          Congratulations: {result}
        </div>
      )}
    </div>
  );
};

export default Decision;
