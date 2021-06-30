import React, { useContext } from "react";

import { MatchupSide, MatchupSideAlignment } from "../matchupSide/matchupSide";

import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";
import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IPlayer } from "../../../../../stroll-models/player";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface MatchupProps {  
  dayStatus: GameStatus;
  matchup: IMatchup;
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { player, predictions } = useContext(GamePageContext).state;

  const { dayStatus, matchup } = props;

  const getMyPrediction = (): JSX.Element => {
    const myPrediction: IPrediction = PredictionUtility.getById(player.id, matchup.id, predictions);
    
    if(myPrediction) {      
      const predictedPlayer: IPlayer = myPrediction.ref.player === matchup.left.ref
        ? matchup.left.player
        : matchup.right.player;

      const style: React.CSSProperties = { color: `rgb(${predictedPlayer.profile.color})` };

      if(matchup.winner && myPrediction.ref.player === matchup.winner) {      
        return (        
          <h1 className="my-prediction passion-one-font">You won <span className="highlight-main">{NumberUtility.shorten(PredictionUtility.getPayoutAmount(myPrediction.amount, matchup))}</span> for correctly predicting <i className={predictedPlayer.profile.icon} style={style} /> <span style={style}> {predictedPlayer.profile.username}</span></h1>
        )
      }

      return (        
        <h1 className="my-prediction passion-one-font">You predicted <i className={predictedPlayer.profile.icon} style={style} /> <span style={style}> {predictedPlayer.profile.username}</span> with <span className="highlight-main">{NumberUtility.shorten(myPrediction.amount)}</span></h1>
      )
    }
  }

  return (
    <div className="game-matchup">
      <div className="game-matchup-sides">
        <MatchupSide 
          alignment={MatchupSideAlignment.Left}
          dayStatus={dayStatus}
          matchup={matchup}
          odds={MatchupUtility.calculateOdds(matchup.left, matchup.right)} 
        />
        <h1 className="game-matchup-vs-label passion-one-font">VS</h1>
        <MatchupSide 
          alignment={MatchupSideAlignment.Right}
          dayStatus={dayStatus}
          matchup={matchup}
          odds={MatchupUtility.calculateOdds(matchup.right, matchup.left)} 
        />
      </div>
      {getMyPrediction()}
    </div>
  );
}