import React, { useContext } from "react";

import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { GamePageContext } from "../../gamePage";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IProfileReference } from "../../../../../stroll-models/profileReference";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { InitialValue } from "../../../../../stroll-enums/initialValue";

interface MyPredictionProps {  
  matchup: IMatchup;
  myPrediction: IPrediction;
}

export const MyPrediction: React.FC<MyPredictionProps> = (props: MyPredictionProps) => {   
  const { state } = useContext(GamePageContext);

  const { matchup, myPrediction } = props;

  const profile: IProfileReference = myPrediction.ref.player === matchup.left.profile.uid
    ? matchup.left.profile
    : matchup.right.profile;

  const pointStatement: JSX.Element = <PointStatement amount={myPrediction.amount.toLocaleString()} />,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  if(matchup.winner === "") {    
    const initialPrediction: boolean = myPrediction.ref.creator === myPrediction.ref.player && myPrediction.amount === InitialValue.InitialPredictionPoints;

    const dayStatus: GameStatus = GameDurationUtility.getDayStatus(matchup.day, state.day);

    if(initialPrediction) {
      const addSomeOfYourOwnClause: JSX.Element = dayStatus === GameStatus.Upcoming 
        ? <span>Add some of your own <PointStatement amount="points" /> if you're feeling confident!</span>
        : null;

      return (        
        <h1 className="my-prediction passion-one-font">The game predicted {playerStatement} with {pointStatement} on your behalf. {addSomeOfYourOwnClause}</h1>        
      )
    }

    return (        
      <h1 className="my-prediction passion-one-font">You predicted {playerStatement} with {pointStatement}.</h1>
    )
  } else if(myPrediction.ref.player === matchup.winner) {     
    const payoutAmount: number = PredictionUtility.getPayoutAmount(myPrediction.amount, matchup),
      netAmount: number = PredictionUtility.getNetAmount(myPrediction, matchup),
      payoutPointStatement: JSX.Element = <PointStatement amount={payoutAmount.toLocaleString()} />,
      netPointStatement: JSX.Element = <PointStatement amount={netAmount.toLocaleString()} />;

    return (        
      <h1 className="my-prediction passion-one-font">You received {payoutPointStatement} for correctly predicting {playerStatement} with {pointStatement}. This is a net gain of {netPointStatement}!</h1>
    )
  } else if (myPrediction.ref.player !== matchup.winner) {
    const lostPointAmount: number = myPrediction.ref.player === myPrediction.ref.creator 
      ? (myPrediction.amount - InitialValue.InitialPredictionPoints) 
      : myPrediction.amount;

    const lostPointStatement: JSX.Element = <PointStatement amount={lostPointAmount.toLocaleString()} />

    return (        
      <h1 className="my-prediction passion-one-font">You lost {lostPointStatement} for incorrectly predicting {playerStatement}.</h1>
    )
  }

  return null;
}