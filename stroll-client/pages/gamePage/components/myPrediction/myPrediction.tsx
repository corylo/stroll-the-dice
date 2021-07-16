import React from "react";

import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IProfileReference } from "../../../../../stroll-models/profileReference";

import { InitialValue } from "../../../../../stroll-enums/initialValue";

interface MyPredictionProps {  
  matchup: IMatchup;
  myPrediction: IPrediction;
}

export const MyPrediction: React.FC<MyPredictionProps> = (props: MyPredictionProps) => {   
  const { matchup, myPrediction } = props;

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

  return null;
}