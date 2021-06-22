import React from "react";

import { Button } from "../../../../components/buttons/button";
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
          maxLength={100}
          placeholder="100"
          value={""}
          onChange={(e: any) => {}}
          onKeyDown={() => {}}
        />
      </InputWrapper>
        <Button className="game-matchup-side-input-button passion-one-font" handleOnClick={() => {}}>
          Predict
        </Button>
    </div>
  );
}