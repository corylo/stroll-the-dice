import React from "react";
import _orderBy from "lodash.orderby"

import { LeaderboardRow } from "../../../../components/leaderboard/leaderboardRow/leaderboardRow";

import { PlayerUtility } from "../../../../utilities/playerUtility";

import { IGameDaySummaryPlayerReference } from "../../../../../stroll-models/gameDaySummary";
import { IPlayer } from "../../../../../stroll-models/player";

import { Icon } from "../../../../../stroll-enums/icon";

interface GameDayStepLeaderboardProps {  
  players: IPlayer[];
  references: IGameDaySummaryPlayerReference[];
}

export const GameDayStepLeaderboard: React.FC<GameDayStepLeaderboardProps> = (props: GameDayStepLeaderboardProps) => {  
  const getRows = (): JSX.Element[] => {
    return _orderBy(props.references, "steps").slice(0, 3).map((ref: IGameDaySummaryPlayerReference, index: number) => {
      const player: IPlayer = PlayerUtility.getById(ref.id, props.players);

      if(player) {
        return (
          <LeaderboardRow 
            key={ref.id} 
            amount={ref.steps}
            icon={Icon.Steps}
            place={index + 1} 
            profile={player.profile} 
          />
        );
      }

      return null;
    });
  }

  return (
    <div className="game-day-step-leaderboard">
      <div className="game-day-step-leaderboard-title">
        <h1 className="passion-one-font">Daily Step Leaders</h1>
      </div>
      <div className="game-day-step-leaderboard-rows">
        {getRows()}
      </div>
    </div>
  );
}