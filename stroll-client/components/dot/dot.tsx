import React from "react";

interface DotProps {  
  
}

export const Dot: React.FC<DotProps> = (props: DotProps) => {  
  return (
    <span className="dot">·</span>
  );
}