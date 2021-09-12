import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { Nano } from "../../../stroll-utilities/nanoUtility";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

export interface IConfettiParticle {
  animationIndex: number;
  animationDuration: number;
  colorIndex: number;
  id: string;
  left: number;
  size: number;
}

interface ConfettiParticleProps {  
  containerWidth: number;
}

export const ConfettiParticle: React.FC<ConfettiParticleProps> = (props: ConfettiParticleProps) => {
  const getRandomParticle = (): IConfettiParticle => {
    const animationDuration: number = NumberUtility.random(2000, 5000);

    const getAnimationIndex = (): number => {
      if(animationDuration < 3000) {
        return 1;
      } else if (animationDuration < 4000) {
        return 2;
      }

      return 3;
    }

    return {
      animationDuration,
      animationIndex: getAnimationIndex(), 
      colorIndex: NumberUtility.random(1, 5),
      id: Nano.generate(10),
      left: Math.floor(Math.random() * props.containerWidth),
      size: NumberUtility.random(5, 10)
    }
  };

  const [show, setShowTo] = useState<boolean>(false),
    [initialDelay] = useState<number>(NumberUtility.random(0, 3000)),
    [particle, setParticleTo] = useState<IConfettiParticle>(getRandomParticle());

  useEffect(() => {
    setTimeout(() => {
      setShowTo(true);
    }, initialDelay);
  }, []);

  useEffect(() => {
    if(show) {
      const newParticle: IConfettiParticle = getRandomParticle();

      const timeout: NodeJS.Timeout = setTimeout(() => {
        setParticleTo(newParticle);
      }, newParticle.animationDuration);

      return () => {
        clearTimeout(timeout);
      }
    }
  }, [particle, show]);

  if(show) {
    const classes: string = classNames(
      "confetti-particle", 
      `confetti-animation-${particle.animationIndex}`, 
      `confetti-color-${particle.colorIndex}`
    );

    const styles: React.CSSProperties = {
      animationDelay: `-${particle.animationDuration}ms`,
      animationDuration: `${particle.animationDuration}ms`,
      height: `${particle.size}px`,
      left: `${particle.left}px`,
      width: `${particle.size}px`
    }

    return (
      <div className={classes} style={styles} />
    );
  }

  return null;
}