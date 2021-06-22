import React from "react";

import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

interface MatchupSideInputProps {  
  
}

export const MatchupSideInput: React.FC<MatchupSideInputProps> = (props: MatchupSideInputProps) => {      
  return (
    <div className="game-matchup-side-input-wrapper">
      <InputWrapper
        value={""}
        error={null}
      >
        <input 
          type="text"
          className="passion-one-font"
          placeholder="126400"
          value={""}
          onChange={(e: any) => {}}
          onKeyDown={() => {}}
        />
      </InputWrapper>
        <IconButton 
          className="game-matchup-side-input-button passion-one-font" 
          icon="fal fa-check"
          handleOnClick={() => {}}
        />
    </div>
  );
}