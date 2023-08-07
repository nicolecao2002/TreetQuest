import React, { useState, useEffect, useRef } from 'react';
import './Board.css';
import doodlerRightImg from './doodler-right.png';
import doodlerLeftImg from './doodler-left.png';
import platformImg from './platform.png';

const Board = ({ width, height }) => {
  const canvasRef = useRef(null);
  const platformWidth = 60;
  const platformHeight = 18;
  let gameOver = false;
  let velocityX = 0;
  let velocityY = -8;

  let doodler = {
    img: new Image(),
    x: width / 2 - 46 / 2,
    y: height * 7 / 8 - 46,
    width: 46,
    height: 46
  };

  const platformImage = new Image();
  platformImage.src = platformImg;

  const platformArray = [];
  let score = 0;
  let maxScore = 0;
  let animationFrameId = null; // Store the requestAnimationFrame ID

  function update() {
    if (gameOver) {
      stopAnimation(); // Stop animation when the game is over
      return;
    }
      
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    // Wrap the doodler's x position around the canvas
    if (doodler.x > width) {
      doodler.x = -doodler.width;
    } else if (doodler.x + doodler.width < 0) {
      doodler.x = width;
    }

    // Draw doodler
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Draw platforms
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Draw score
    context.fillStyle = 'black';
    context.font = '16px sans-serif';
    context.fillText(score, 5, 20);

    // Update score
    updateScore();

    // Update doodler position
    doodler.x += velocityX;

    // Apply gravity to the doodler
    velocityY += 0.4;
    doodler.y += velocityY;

    // Check for collisions with platforms
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      if (velocityY < 0 && doodler.y < height * 3 / 4) {
        platform.y -= velocityY; // Slide platform up when the doodler is going up
      }
      if (detectCollision(doodler, platform) && velocityY >= 0) {
        velocityY = -8; // Doodler jumps when colliding with a platform from the bottom
      }
      context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= height) {
      platformArray.shift(); // Remove the first element from the array (platform that is out of the canvas)
      newPlatform(); // Add a new platform on top
    }

    // Check for game over condition
    if (doodler.y > height) {
      gameOver = true;
    }

    // Request animation frame to continue the loop
    animationFrameId = requestAnimationFrame(update);

    // Draw game over text
    if (gameOver) {
      context.fillText('Game Over: Press "Space" to Restart', width / 7, height * 7 / 8);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    doodler.img.src = doodlerRightImg;
    doodler.img.onload = () => {
      context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    };

    platformImage.onload = () => {
      placePlatforms();
      animationFrameId = requestAnimationFrame(update);
    };

    document.addEventListener('keydown', moveDoodler);

    // Make sure to remove the event listener and stop animation when the component is unmounted
    return () => {
      document.removeEventListener('keydown', moveDoodler);
      stopAnimation();
    };
  }, []);

  function moveDoodler(e) {
    // Move the doodler based on the keyboard input
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      velocityX = 4;
      doodler.img.src = doodlerRightImg;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      velocityX = -4;
      doodler.img.src = doodlerLeftImg;
    }

    // Handle game restart on space key
    if (e.code === 'Space' && gameOver) {
      velocityX = 0;
        velocityY = -8;
         doodler.x = width / 2 - 46 / 2,
    doodler.y = height * 7 / 8 - 46,
      score = 0;
      maxScore = 0;
      gameOver = false;
      placePlatforms();
      requestAnimationFrame(update);
    }
  }

  const placePlatforms = () => {
    platformArray.length = 0; // Clear the array

    // Add the starting platform
    platformArray.push({
      img: platformImage,
      x: width / 2,
      y: height - 50,
      width: platformWidth,
      height: platformHeight
    });

    // Add additional random platforms
    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor(Math.random() * (width * 3 / 4));
      const platform = {
        img: platformImage,
        x: randomX,
        y: height - 75 * i - 150,
        width: platformWidth,
        height: platformHeight
      };
      platformArray.push(platform);
    }
  };

  function updateScore() {
    let points = Math.floor(50 * Math.random());
    if (velocityY < 0) {
      maxScore += points;
      if (score < maxScore) {
        score = maxScore;
      }
    } else if (velocityY >= 0) {
      maxScore -= points;
    }
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function newPlatform() {
    let randomX = Math.floor(Math.random() * (width * 3 / 4));
    const platform = {
      img: platformImage,
      x: randomX,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight
    };
    platformArray.push(platform);
  }

  function stopAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="board"
    />
  );
};

export default Board;
