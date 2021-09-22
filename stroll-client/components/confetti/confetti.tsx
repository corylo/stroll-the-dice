import React, { useEffect } from "react";
import CanvasConfetti from "canvas-confetti";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

interface ConfettiProps {  
  
}

export const Confetti: React.FC<ConfettiProps> = (props: ConfettiProps) => { 
  const duration: number = 5000,
    endsAt: number = Date.now() + duration;

  const defaultOptions: CanvasConfetti.Options = { 
    particleCount: Math.max(window.innerWidth / 20, 100), 
    scalar: Math.min(1, window.innerWidth / 2000),
    spread: 360, 
    startVelocity: 30,     
    ticks: 100 
  };
  
  const fire = (origin: any): void => {
    CanvasConfetti({ ...defaultOptions, origin });
  }

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeRemaining: number = endsAt - Date.now();

      if(timeRemaining <= 0) {
        clearInterval(interval);
      }

      fire({
        x: NumberUtility.randomDecimal(0.1, 0.3), 
        y: Math.random() - 0.2
      });

      fire({
        x: NumberUtility.randomDecimal(0.7, 0.9), 
        y: Math.random() - 0.2
      });
    }, 500);

    return () => {
      clearInterval(interval);
      CanvasConfetti.reset();
    }
  }, []);  

  return null;
}