import React from "react";
import { Link } from "react-router-dom";

import { FormBodySection } from "../form/formBodySection";
import { GameDayStatement } from "../gameDayStatement/gameDayStatement";

import { IGame } from "../../../stroll-models/game";

interface GameDayRequirementProps {  
  available: number;
  duration?: number;
  game?: IGame;
  type: "create" | "join";
}

export const GameDayRequirement: React.FC<GameDayRequirementProps> = (props: GameDayRequirementProps) => {    
  const getText = (): JSX.Element => {
    if(props.game) {
      const costStatement: JSX.Element = <GameDayStatement quantity={props.game.duration} />;

      return (
        <h1 className="passion-one-font">This game costs {costStatement} for players to {props.type}.</h1>
      );
    } else if (props.duration !== undefined) {

      const costStatement: JSX.Element = <GameDayStatement quantity={props.duration} />,
        availableStatement: JSX.Element = <GameDayStatement quantity={props.available} />;

      return (
        <h1 className="passion-one-font">This game will cost {costStatement} to {props.type}. You currently have {availableStatement} available.</h1>
      );
    }
  }

  return (
    <FormBodySection className="game-day-requirement-section">
      {getText()}
      <Link
        className="go-to-store-button button link fancy-button"            
        to="/shop"
        target="_blank"
      >
        <i className="fal fa-store" />
        <h1 className="passion-one-font">Shop</h1>
      </Link>
    </FormBodySection>
  )
}