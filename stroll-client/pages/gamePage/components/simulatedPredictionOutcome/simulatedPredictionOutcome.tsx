import React from "react";

import { Label } from "../../../../components/label/label";
import { PointStatement } from "../../../../components/pointStatement/pointStatement";
import { ReturnRatioStatement } from "../../../../components/returnRatioStatement/returnRatioStatement";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

interface SimulatedPredictionOutcomeProps {  
  amount: number;
  currentAmount: number;
  matchup: IMatchup;
  playerID: string;
}

export const SimulatedPredictionOutcome: React.FC<SimulatedPredictionOutcomeProps> = (props: SimulatedPredictionOutcomeProps) => {     
  const { matchup } = props;

  let odds: number = 0;

  if(matchup.left.playerID === props.playerID) {
    matchup.left.total.wagered = matchup.left.total.wagered + props.amount;

    odds = MatchupUtility.calculateOdds(matchup.left, matchup.right);
  } else if(matchup.right.playerID === props.playerID) {
    matchup.right.total.wagered = matchup.right.total.wagered + props.amount;

    odds = MatchupUtility.calculateOdds(matchup.right, matchup.left);
  }

  const returnRatioStatement: JSX.Element = <ReturnRatioStatement odds={odds} />,
    payoutStatement: JSX.Element = <PointStatement amount={Math.round((props.currentAmount + props.amount) * odds)} />;

  return (
    <div className="simulated-prediction-outcome-wrapper">
      <h1 className="simulated-prediction-outcome passion-one-font">Submitting this prediction will adjust the return ratio to {returnRatioStatement}. If correct, you will receive {payoutStatement} (includes the amount you predicted with).</h1>
      <Label
        className="warning-message"
        icon="fal fa-exclamation-triangle"
        text="The return ratio will change if more players place predictions."
      />       
    </div>
  );
}