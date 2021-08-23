import React from "react";

import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IProfileReference } from "../../../../../stroll-models/profileReference";

interface MyPredictionProps {  
  matchup: IMatchup;
  myPrediction: IPrediction;
}

export const MyPrediction: React.FC<MyPredictionProps> = (props: MyPredictionProps) => {   
  const { matchup, myPrediction } = props;

  const profile: IProfileReference = myPrediction.ref.player === matchup.left.playerID
    ? matchup.left.profile
    : matchup.right.profile;

  const pointStatement: JSX.Element = <PointStatement amount={myPrediction.amount.toLocaleString()} />,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  if(matchup.winner === "") {
    return (        
      <h1 className="my-prediction passion-one-font">You predicted {playerStatement} with {pointStatement}.</h1>
    )
  } else if(myPrediction.ref.player === matchup.winner) {     
    const payoutAmount: number = PredictionUtility.getPayoutAmount(myPrediction.amount, matchup),
      payoutPointStatement: JSX.Element = <PointStatement amount={payoutAmount.toLocaleString()} />;

    return (        
      <h1 className="my-prediction passion-one-font">You received {payoutPointStatement} for correctly predicting {playerStatement} with {pointStatement}.</h1>
    )
  } else if (myPrediction.ref.player !== matchup.winner) {
    const lostPointStatement: JSX.Element = <PointStatement amount={myPrediction.amount.toLocaleString()} />

    return (        
      <h1 className="my-prediction passion-one-font">You lost {lostPointStatement} for incorrectly predicting {playerStatement}.</h1>
    )
  }

  return null;
}