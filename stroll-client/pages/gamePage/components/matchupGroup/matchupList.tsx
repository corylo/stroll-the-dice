import React, { useContext } from "react";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";
import { Matchup } from "../matchup/matchup";

import { GamePageContext } from "../../gamePage";
import { MatchupGroupContext } from "./matchupGroup";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface MatchupsListProps {  
  day: number;
}

export const MatchupList: React.FC<MatchupsListProps> = (props: MatchupsListProps) => {  
  const { players } = useContext(GamePageContext).state;

  const { state } = useContext(MatchupGroupContext);

  const getMatchups = (): JSX.Element[] => {
    if(
      state.statuses.matchups === RequestStatus.Success && 
      state.statuses.predictions === RequestStatus.Success
    ) {
      const matchups: IMatchup[] = MatchupUtility.mapProfilesToMatchups(state.matchups, players);

      return matchups.map((matchup: IMatchup) =>       
        <Matchup 
          key={matchup.id} 
          matchup={matchup} 
          predictions={state.predictions}
        />
      );
    }
  }

  const getLoadingMessage = (): JSX.Element => {
    if(
      state.statuses.matchups === RequestStatus.Loading || 
      state.statuses.predictions === RequestStatus.Loading
    ) {
      return (
        <LoadingMessage borderless text="Loading Matchups" />
      )
    }
  }

  return (
    <div className="game-matchups-list">
      {getMatchups()}
      {getLoadingMessage()}
    </div>
  )
}