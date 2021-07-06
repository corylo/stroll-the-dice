import React, { useContext } from "react";
import classNames from "classnames";

import { Label } from "../../../../components/label/label";
import { MatchupSidePrediction } from "../matchupSidePrediction/matchupSidePrediction";
import { MatchupSideStat } from "./matchupSideStat";
import { ProfileIcon } from "../../../../components/profileIcon/profileIcon";

import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";
import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

export enum MatchupSideAlignment {
  Left = "left",
  Right = "right"
}

interface MatchupSideProps {  
  alignment: MatchupSideAlignment;
  dayStatus: GameStatus;
  matchup: IMatchup;
  odds: number;
}

export const MatchupSide: React.FC<MatchupSideProps> = (props: MatchupSideProps) => {  
  const { day, game, player, predictions } = useContext(GamePageContext).state;

  const { alignment, dayStatus, matchup, odds } = props;
  
  const side: IMatchupSide = matchup[alignment];

  if(side.player) {
    const { profile } = side.player;

    const leader: boolean = MatchupUtility.getLeader(matchup)=== side.ref,
      myPrediction: IPrediction = PredictionUtility.getById(player.id, matchup.id, predictions);
    
    const getMatchupSidePrediction = (): JSX.Element => {      
      if(PredictionUtility.available(matchup, side, player, myPrediction, day)) {
        return (
          <MatchupSidePrediction 
            matchup={matchup}
            myPrediction={myPrediction}
            playerID={side.ref}
          />
        )
      }
    }

    const getLeaderLabel = (): JSX.Element => {
      if(leader) {
        const text: string = dayStatus === GameStatus.Completed
          ? "Winner"
          : "Leader";

        return (
          <Label 
            className="game-matchup-side-leader-label" 
            icon="fal fa-trophy" 
            styles={{ color: `rgb(${profile.color})`}}
            text={text}
          />
        )
      }
    }

    const getStyles = (): React.CSSProperties => {
      if(leader) {
        const { color } = side.player.profile;

        const background: string = alignment === MatchupSideAlignment.Left 
          ? `linear-gradient(to right, rgba(${color}, 0.15), transparent)`
          : `linear-gradient(to left, rgba(${color}, 0.15), transparent)`;

        const styles: React.CSSProperties = { background };

        if(alignment === MatchupSideAlignment.Left) {
          styles.borderLeft = `2px solid rgb(${color})`;
        } else {
          styles.borderRight = `2px solid rgb(${color})`;
        }

        return styles;
      }
    }

    return (
      <div className={classNames("game-matchup-side", props.alignment)} style={getStyles()}>
        <ProfileIcon 
          color={profile.color}
          icon={profile.icon}
        />
        <h1 className="game-matchup-side-username passion-one-font" style={{ color: `rgb(${profile.color})` }}>{profile.username}</h1>     
        <div className="game-matchup-side-stats">
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-shoe-prints" 
            tooltip="Steps"
            value={side.steps ? side.steps.toLocaleString() : "0"} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-sack-dollar" 
            tooltip="Total Wagered"
            value={side.total.wagered ? NumberUtility.shorten(side.total.wagered) : "-"} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-dice" 
            tooltip="Odds"
            value={`1 : ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(odds)}`} 
          />
          <MatchupSideStat 
            alignment={props.alignment}
            icon="fal fa-user-friends" 
            tooltip="Participants"
            value={side.total.participants} 
          />
        </div>   
        {getLeaderLabel()}
        {getMatchupSidePrediction()}
      </div>
    )
  }

  const getText = (): string => {
    return game.status === GameStatus.Upcoming
      ? "Undetermined"
      : "Bye";
  }

  const getIcon = (): string => {
    return game.status === GameStatus.Upcoming
      ? "fal fa-question"
      : "fal fa-hand-scissors";
  }

  return (
    <div className="game-matchup-side undetermined">
      <div className="game-matchup-side-undetermined">
        <ProfileIcon color="230, 230, 230" icon={getIcon()} />
        <h1 className="game-matchup-side-username passion-one-font" style={{ color: "rgb(230, 230, 230)" }}>{getText()}</h1>     
      </div>
    </div>
  );
}