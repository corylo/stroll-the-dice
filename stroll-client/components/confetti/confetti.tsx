import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

interface ConfettiProps {  
  id: string;
}

export const Confetti: React.FC<ConfettiProps> = (props: ConfettiProps) => {  
  const ref: React.MutableRefObject<HTMLDivElement> = useRef(null);

  const [element, setElement] = useState<HTMLElement>(null);

  useEffect(() => {
    const el: HTMLElement = document.getElementById(props.id);

    if(el !== null) {
      setElement(el);
    }
  }, []);  

  const getConfettiParticles = (): JSX.Element[] => {    
    if(element) {
      const count: number = (element.clientWidth / 50) * 10;

      let particles: JSX.Element[] = [];

      for(let i: number = 0; i <= count; i++) {
        const getStyles = (): React.CSSProperties => {          
          return {
            animationDelay: `${NumberUtility.random(0, 30) / 10}s`,
            height: `${NumberUtility.random(2, 4)}px`,
            left: `${NumberUtility.random(5, 95)}%`,
            top: `${NumberUtility.random(20, 60)}%`,
            width: `${NumberUtility.random(6, 8)}px`            
          }
        }

        particles.push(
          <span 
            key={i}
            className={classNames("confetti-particle", `confetti-particle-${NumberUtility.random(1, 4)}`)}
            style={getStyles()}
          />
        );
      }

      return particles;
    }
  }

  return (
    <div id={props.id} ref={ref} className="confetti-effect">
      {getConfettiParticles()}
    </div>
  );
}