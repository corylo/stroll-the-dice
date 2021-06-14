import React, { useRef, useState } from "react";

import { IconButton } from "../buttons/iconButton";
import { TooltipSide } from "../tooltip/tooltip";

interface CopyButtonProps {
  icon: string;
  tooltip: string;
  value: string;
}

export const CopyButton: React.FC<CopyButtonProps> = (props: CopyButtonProps) => {
  const copyRef: any = useRef(null);

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = (): void => {
    copyRef.current.select();
    document.execCommand("copy");
    setCopied(true);
  }

  const handleOnFocus = (): void => {
    setTimeout(() => copyRef.current.blur(), 10);
  }

  return(
    <div className="copy-button">
      <IconButton 
        className="copy-button-icon"
        icon={props.icon} 
        tooltip={copied ? "Copied" : `Copy ${props.tooltip}`}
        tooltipSide={TooltipSide.Bottom}
        handleOnClick={handleCopyLink} 
      />    
      <input 
        ref={copyRef} 
        className="copy-button-value"
        type="text"
        tabIndex={-1}
        value={props.value} 
        onChange={() => {}}
        onFocus={handleOnFocus}
      />
    </div>
  )
}