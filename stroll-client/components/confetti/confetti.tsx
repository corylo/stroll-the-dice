import React, { useEffect, useRef, useState } from "react";

import { ConfettiParticle } from "./confettiParticle";

interface ConfettiProps {  
  id: string;
}

export const Confetti: React.FC<ConfettiProps> = (props: ConfettiProps) => {  
  const ref: React.MutableRefObject<HTMLDivElement> = useRef(null);

  const [container, setContainerTo] = useState<HTMLElement>(null),
    [visible, setVisibleTo] = useState<boolean>(true);

  useEffect(() => {
    const element: HTMLElement = document.getElementById(props.id);

    if(element !== null) {
      setContainerTo(element);
    }
  }, []);  

  useEffect(() => {
    if(container) {
      const handleOnScroll = (e: any): void => {      
        const rect: DOMRect = container.getBoundingClientRect();
        
        if(rect.bottom <= 0 && visible) {
          setVisibleTo(false);
        } else if (rect.bottom > 0 && !visible) {
          setVisibleTo(true);
        }
      }

      document.addEventListener("scroll", handleOnScroll);

      return () => {
        document.removeEventListener("scroll", handleOnScroll);
      }
    }
  }, [container, visible]);

  const getConfettiParticles = (): JSX.Element[] => {    
    if(container !== null && visible) {
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