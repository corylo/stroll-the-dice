import React from "react";

import { PointStatement } from "../../../../components/pointStatement/pointStatement";
import { ReturnRatioStatement } from "../../../../components/returnRatioStatement/returnRatioStatement";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { defaultMatchup, IMatchup } from "../../../../../stroll-models/matchup";

interface SimulatedPredictionOutcomeProps {  
  amount: number;
  currentAmount: number;
  matchup: IMatchup;
  playerID: string;
}

export const SimulatedPredictionOutcome: React.FC<SimulatedPredictionOutcomeProps> = (props: SimulatedPredictionOutcomeProps) => {     
  const { matchup } = props;

  const amount: number = props.currentAmount + props.amount;

  let odds: number = 0;

  if(matchup.left.playerID === props.playerID) {
    matchup.left.total.wagered = matchup.left.total.wagered + amount;

    odds = MatchupUtility.calculateOdds(matchup.left, matchup.right);
  } else if(matchup.right.playerID === props.playerID) {
    matchup.right.total.wagered = matchup.right.total.wagered + amount;

    odds = MatchupUtility.calculateOdds(matchup.right, matchup.left);
  }

  const returnRatioStatement: JSX.Element = <ReturnRatioStatement odds={odds} />,
    payoutStatement: JSX.Element = <PointStatement amount={Math.round(amount * odds)} />;

  return (
    <h1 className="simulated-prediction-outcome passion-one-font">Submitting this prediction will adjust the return ratio to {returnRatioStatement}. If correct, you will win {payoutStatement}!</h1>
  );
}