import React, { useEffect, useRef, useState } from "react";

import { ConfettiParticle } from "./confettiParticle";

interface ConfettiProps {  
  id: string;
}

export const Confetti: React.FC<ConfettiProps> = (props: ConfettiProps) => {  
  const ref: React.MutableRefObject<HTMLDivElement> = useRef(null);

  const [container, setContainerTo] = useState<HTMLElement>(null);

  useEffect(() => {
    const element: HTMLElement = document.getElementById(props.id);

    if(element !== null) {
      setContainerTo(element);
    }
  }, []);  

  const getConfettiParticles = (): JSX.Element[] => {    
    if(container !== null) {
      let particles: JSX.Element[] = [];

      for(let i: number = 0; i < 60; i++) {
        particles.push(
          <ConfettiParticle 
            key={i} 
            containerWidth={container.offsetWidth} 
          />
        );
      }

      return particles;
    }

    return [];
  }

  return (
    <div id={props.id} ref={ref} className="confetti-effect">
      {getConfettiParticles()}
    </div>
  );
}