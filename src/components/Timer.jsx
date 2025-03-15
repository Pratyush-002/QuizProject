import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ initialTime, onTimeUp, currentQuestionId, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current); // Stop the timer if paused
      return;
    }

    setTimeLeft(initialTime); // Reset timer
    clearInterval(timerRef.current); // Clear any existing interval

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          onTimeUp(); // Notify parent that time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionId, initialTime, isPaused]);

  const formattedTime = timeLeft < 10 ? `0${timeLeft}` : timeLeft;

  return (
    <div className="gigapromo-timer">
      <div className="gigapromo-time-left">Time Left</div>
      <div className="gigapromo-timer-seconds">{formattedTime}</div>
    </div>
  );
};

export default Timer;
