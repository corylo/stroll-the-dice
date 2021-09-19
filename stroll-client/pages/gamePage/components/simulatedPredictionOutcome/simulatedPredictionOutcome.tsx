import React from "react";

import { PointStatement } from "../../../../components/pointStatement/pointStatement";
import { ReturnRatioStatement } from "../../../../components/returnRatioStatement/returnRatioStatement";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { MatchupSideAlignment } from "../matchupSide/matchupSide";

interface SimulatedPredictionOutcomeProps {  
  amount: number;
  currentAmount: number;
  matchup: IMatchup;
  playerID: string;
}

export const SimulatedPredictionOutcome: React.FC<SimulatedPredictionOutcomeProps> = (props: SimulatedPredictionOutcomeProps) => {     
  const { matchup } = props;

  const getAlignment = (): MatchupSideAlignment => { 
    if(matchup.left.playerID === props.playerID) {
      return MatchupSideAlignment.Left;
    } else if(matchup.right.playerID === props.playerID) {
      return MatchupSideAlignment.Right;
    }
    
    return null;
  }

  const alignment: MatchupSideAlignment = getAlignment();

  const getRatio = (): number => {    
    if(alignment === MatchupSideAlignment.Left) {
      matchup.left.total.wagered = matchup.left.total.wagered + props.amount;

      return MatchupUtility.calculateOdds(matchup.left, matchup.right);
    } else if(alignment === MatchupSideAlignment.Right) {
      matchup.right.total.wagered = matchup.right.total.wagered + props.amount;

      return MatchupUtility.calculateOdds(matchup.right, matchup.left);
    }

    return 1;
  }

  const ratio: number = getRatio();

  const getPointStatementAmount = (): number => {
    if(props.amount > 0 || props.currentAmount > 0) {
      const totalAmount: number = props.currentAmount + props.amount;

      return Math.round(totalAmount * ratio) - totalAmount;
    }

    return 0;
  }

  const getFormulaLeftSideTotal = (): number => {
    if(alignment === MatchupSideAlignment.Left) {
      return matchup.left.total.wagered;
    } else if (alignment === MatchupSideAlignment.Right) {
      return matchup.right.total.wagered;
    }
    
    return 0;
  }

  const getFormulaRightSideTotal = (): number => {
    if(alignment === MatchupSideAlignment.Left) {
      return matchup.right.total.wagered;
    } else if (alignment === MatchupSideAlignment.Right) {
      return matchup.left.total.wagered;
    }
    
    return 0;
  }

  const getFormula = (): JSX.Element => {
    const leftSideTotal: number = getFormulaLeftSideTotal(),
      rightSideTotal: number = getFormulaRightSideTotal(),
      overallTotal: number = leftSideTotal + rightSideTotal;

    const formulaNumeratorStatement: JSX.Element = <PointStatement amount={overallTotal.toLocaleString()} />,
      formulaDenominatorStatement: JSX.Element = <PointStatement amount={leftSideTotal.toLocaleString()} />;

    return (
      <h1 className="formula passion-one-font">{formulaNumeratorStatement} / {formulaDenominatorStatement} =</h1>
    )
  }

  return (
    <div className="simulated-prediction-outcome-wrapper">
      <div className="simulated-return-ratio simulated-item">
        {getFormula()}
        <h1 className="value passion-one-font">
          <ReturnRatioStatement ratio={ratio} />
        </h1>
        <h1 className="label passion-one-font">Simulated Return Ratio</h1>
      </div>
      <div className="simulated-earnings simulated-item">
        <h1 className="value passion-one-font">
          <PointStatement amount={getPointStatementAmount().toLocaleString()} />
        </h1>   
        <h1 className="label passion-one-font">Simulated Winnings</h1>
      </div>
    </div>
  );
}