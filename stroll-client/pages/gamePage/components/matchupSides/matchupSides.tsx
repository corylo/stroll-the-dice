import React, { useContext } from "react";

import { IconButton } from "../../../../components/buttons/iconButton";
import { MatchupSide, MatchupSideAlignment } from "../matchupSide/matchupSide";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { AppAction } from "../../../../enums/appAction";
import { HowToPlayID } from "../../../../enums/howToPlayID";

interface MatchupProps {  
  matchup: IMatchup;
}

export const MatchupSides: React.FC<MatchupProps> = (props: MatchupProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const { matchup } = props;

  const toggle = (): void => {    
    dispatch(AppAction.ToggleHowToPlay, { howToPlay: true, howToPlayID: HowToPlayID.Matchups });
  }

  return (
    <div className="game-matchup-sides">
      <MatchupSide 
        alignment={MatchupSideAlignment.Left}
        matchup={matchup}
        ratio={MatchupUtility.calculateRatio(matchup.left, matchup.right)} 
      />
      <div className="game-matchup-vs-label">
        <h1 className="passion-one-font">VS</h1>
        <IconButton
          icon="fal fa-info-circle"
          handleOnClick={toggle}
        />
      </div>
      <MatchupSide 
        alignment={MatchupSideAlignment.Right}
        matchup={matchup}
        ratio={MatchupUtility.calculateRatio(matchup.right, matchup.left)} 
      />
    </div>
  );
}