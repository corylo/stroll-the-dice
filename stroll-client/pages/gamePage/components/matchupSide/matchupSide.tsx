import React from "react";
import classNames from "classnames";

import { MatchupSidePrediction } from "../matchupSidePrediction/matchupSidePrediction";
import { MatchupSideStat } from "./matchupSideStat";
import { ProfileIcon } from "../../../../components/profileIcon/profileIcon";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";

export enum MatchupSideAlignment {
  Left = "left",
  Right = "right"
}

interface MatchupSideProps {  
  alignment: MatchupSideAlignment;
  matchup: IMatchup;
  odds: number;
}

export const MatchupSide: React.FC<MatchupSideProps> = (props: MatchupSideProps) => {  
  const { alignment, matchup, odds } = props;
  
  const side: IMatchupSide = matchup[alignment];

  if(side.player) {
    const { profile } = side.player;
    
    return (
      <div className={classNames("game-matchup-side", props.alignment)}>
        <ProfileIcon 
          color={profile.color}
          icon={profile.icon}
        />
        <h1 className="game-matchup-side-username passion-one-font" style={{ color: `rgb(${profile.color})` }}>{profile.username}</h1>     
        <div className="game-matchup-side-stats">
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-shoe-prints" 
            value={side.steps || "0"} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-money-bill-wave-alt" 
            value={side.total.wagered || "-"} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-dice" 
            value={`1 : ${odds}`} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-user-friends" 
            value={side.total.predictions} 
          />
        </div>
        <MatchupSidePrediction 
          matchupID={matchup.id}
          playerID={side.ref}
        />
      </div>
    )
  }

  return (
    <div className="game-matchup-side">
      <ProfileIcon anonymous />
      <h1 className="game-matchup-side-username passion-one-font" style={{ color: "rgb(230, 230, 230)" }}>Undetermined</h1>     
    </div>
  );
}