import React, { useContext } from "react";

import { MatchupSide, MatchupSideAlignment } from "../matchupSide/matchupSide";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IProfileReference } from "../../../../../stroll-models/profileReference";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { InitialValue } from "../../../../../stroll-enums/initialValue";

interface MatchupProps {  
  dayStatus: GameStatus;
  matchup: IMatchup;
  predictions: IPrediction[];
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { player } = useContext(GamePageContext).state;

  const { dayStatus, matchup, predictions } = props;

  const myPrediction: IPrediction = PredictionUtility.getById(player.id, matchup.id, predictions);

  const getMyPrediction = (): JSX.Element => {
    if(myPrediction) {      
      const profile: IProfileReference = myPrediction.ref.player === matchup.left.profile.uid
        ? matchup.left.profile
        : matchup.right.profile;

      const pointStatement: JSX.Element = <PointStatement amount={myPrediction.amount.toLocaleString()} />,
        playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

      if(matchup.winner === "") {
        const text: string = myPrediction.amount === InitialValue.InitialPredictionPoints ? "automatically" : "";

        return (        
          <h1 className="my-prediction passion-one-font">You {text} predicted {playerStatement} with {pointStatement}</h1>
        )
      } else if(myPrediction.ref.player === matchup.winner) {     
        const payoutPointStatement: JSX.Element = <PointStatement amount={PredictionUtility.getPayoutAmount(myPrediction.amount, matchup).toLocaleString()} />;

        return (        
          <h1 className="my-prediction passion-one-font">You received {payoutPointStatement} for correctly predicting {playerStatement}</h1>
        )
      } else if (myPrediction.ref.player !== matchup.winner) {
        return (        
          <h1 className="my-prediction passion-one-font">You lost {pointStatement} for incorrectly predicting {playerStatement}</h1>
        )
      }
    }
  }

  return (
    <div className="game-matchup">
      <div className="game-matchup-sides">
        <MatchupSide 
          alignment={MatchupSideAlignment.Left}
          dayStatus={dayStatus}
          matchup={matchup}
          myPrediction={myPrediction}
          odds={MatchupUtility.calculateOdds(matchup.left, matchup.right)} 
        />
        <h1 className="game-matchup-vs-label passion-one-font">VS</h1>
        <MatchupSide 
          alignment={MatchupSideAlignment.Right}
          dayStatus={dayStatus}
          matchup={matchup}
          myPrediction={myPrediction}
          odds={MatchupUtility.calculateOdds(matchup.right, matchup.left)} 
        />
      </div>
      {getMyPrediction()}
    </div>
  );
}