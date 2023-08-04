// Decision.js

import "./Decision.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Decision = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [segmentData, setSegmentData] = useState([]);
  const [selectedSize, setSelectedSize] = useState("small");
  const [displayedSegments, setDisplayedSegments] = useState([]);
  const [taskCompletionCount, setTaskCompletionCount] = useState({
    small: 0,
    medium: 0,
    large: 0,
  });
  const [randomColors, setRandomColors] = useState([]);

  useEffect(() => {
    // Fetch segment data from the backend API
    const userId = getCookie("ID");
    axios
      .get(`http://localhost:3002/decision`, { params: { userId } })
      .then((response) => {
        const rewardData = response.data; // Assuming the response is an array of objects with reward_name and reward_level
        setSegmentData(rewardData);

        // Filter the data to only include "small" reward-level segments initially
        const initialSegments = rewardData.filter((segment) => segment.reward_level === "small");
        setDisplayedSegments(initialSegments);
      })
      .catch((error) => {
        console.error("Error fetching segment data:", error);
      });

    // Fetch user's task completion data from the backend API
    axios
      .get(`http://localhost:3002/todolistMain`, { params: { userId } })
      .then((response) => {
        const userTasks = response.data; // Assuming the response is an array of objects with task_id, task_level, and status

        // Calculate the task completion count for each level
        const taskCountByLevel = userTasks.reduce((countByLevel, task) => {
          if (task.status === "completed") {
            countByLevel[task.task_level] = (countByLevel[task.task_level] || 0) + 1;
          }

          return countByLevel;
        }, {});

        setTaskCompletionCount(taskCountByLevel);
      })
      .catch((error) => {
        console.error("Error fetching user's task data:", error);
      });

    // Generate the random colors once when the component mounts
    const generatedColors = Array.from({ length: displayedSegments.length }, () => getRandomColor());
    setRandomColors(generatedColors);
  }, [displayedSegments.length]);

  // Add a useEffect hook to update displayedSegments whenever selectedSize changes
  useEffect(() => {
    const filteredSegments = segmentData.filter((segment) => segment.reward_level === selectedSize);
    setDisplayedSegments(filteredSegments);
  }, [segmentData, selectedSize]);

  // Add another useEffect hook to update the reward names whenever displayedSegments or selectedSize changes
  useEffect(() => {
    const generatedColors = Array.from({ length: displayedSegments.length }, () => getRandomColor());
    setRandomColors(generatedColors);
  }, [displayedSegments, selectedSize]);

  const handleSpin = () => {
    if (spinning) return; // Prevent spinning if already spinning
    if (!selectedSize) return; // Prevent spinning if size is not selected

    setSpinning(true);

    // Random number of rotations (between 3 and 6)
    const rotations = 3 + Math.floor(Math.random() * 4);

    // Rotate for the specified number of rotations
    const totalRotation = 360 * rotations;
    const filteredData = segmentData.filter((segment) => segment.reward_level === selectedSize);
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    const segmentAngle = 360 / filteredData.length;
    const resultAngle = totalRotation + (filteredData.length - randomIndex - 1) * segmentAngle;

    setTimeout(() => {
      setResult(filteredData[randomIndex]);
      setSpinning(false);
    }, 5000 + totalRotation); // Wait for 5000ms + totalRotation before stopping the spinning
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
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
      <div className="option">
        <h3>HOW TO USE the wheel:</h3>
        <p>
          Once you finish a task, you can choose a level to spin depends on what level of that
          task is (i.e small, medium, and large), you will get a randomized result and then enjoy
          the reward!{" "}
        </p>
        <div className="size-buttons">
          <button onClick={() => handleSizeSelection("small")}>Small Reward</button>
          <button onClick={() => handleSizeSelection("medium")}>Medium Reward</button>
          <button onClick={() => handleSizeSelection("large")}>Large Reward</button>
        </div>
        {!spinning && result && (
          <div
            className={`result-segment ${result.reward_level !== selectedSize ? "hidden" : ""}`}
            style={{ color: randomColors[displayedSegments.indexOf(result)] }}
          >
            Congratulations: {result.reward_name}
          </div>
        )}
        <a href="/dashboard" className="return-link">
          Return to Dashboard
        </a>
        <p>Small Tasks Completed: {taskCompletionCount.small ?? 0}</p>
        <p>Medium Tasks Completed: {taskCompletionCount.medium ?? 0}</p>
        <p>Large Tasks Completed: {taskCompletionCount.large ?? 0}</p>
      </div>
      <div className={`decision-wrapper ${spinning ? "spin" : ""}`}>
        <div className={`spin_container ${spinning ? "spin" : ""}`}>
          {displayedSegments.map((segment, index) => (
            <div
              key={index}
              className={`segment segment-${index + 1}`}
              style={{
                backgroundColor: randomColors[index], // Use the stored random color here
                transform: `rotate(${(360 / displayedSegments.length) * index}deg)`,
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
        {displayedSegments.map((segment, index) => (
          <div
            key={index}
            className={`reward-name ${segment.reward_level !== selectedSize ? "hidden" : ""}`}
            style={{ color: randomColors[index] }}
          >
            {segment.reward_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Decision;
