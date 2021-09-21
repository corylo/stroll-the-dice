import React, { useEffect, useRef } from "react";
import CanvasConfetti from "canvas-confetti";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

interface ConfettiProps {  
  
}

export const Confetti: React.FC<ConfettiProps> = (props: ConfettiProps) => {  
  const ref: React.MutableRefObject<HTMLCanvasElement> = useRef(null);

  const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;  

  let skew: number = 1;

  const duration: number = 15 * 1000,
    animationEnd: number = Date.now() + duration;

  const colors: string[] = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

  useEffect(() => {
    if(ref.current) {  
      (function frame() {
        skew = Math.max(0.8, 1 - 0.001);

        const timeLeft: number = animationEnd - Date.now(),
          ticks: number = Math.max(100, 200 * (timeLeft / duration)),
          color: string = colors[NumberUtility.random(1, 5)];

        CanvasConfetti({
          particleCount: 1,
          startVelocity: 0,
          ticks,
          origin: {
            x: Math.random(),
            y: (Math.random() * skew) - 0.2
          },
          colors: [color],
          shapes: ["circle"],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(0.4, 1),
          drift: randomInRange(-0.4, 0.4)

        });

        requestAnimationFrame(frame);
      })();
    }
  }, [ref]);  

  return (
    <canvas ref={ref} />
  );
}