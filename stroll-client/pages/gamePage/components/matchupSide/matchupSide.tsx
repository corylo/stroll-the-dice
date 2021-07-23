import React, { useContext } from "react";
import classNames from "classnames";

import { Label } from "../../../../components/label/label";
import { ProfileIcon } from "../../../../components/profileIcon/profileIcon";

import { GamePageContext } from "../../gamePage";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { MatchupSideStats } from "../matchupSideStats/matchupSideStats";

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
  const { day, game } = useContext(GamePageContext).state;

  const { alignment, matchup, odds } = props;
  
  const side: IMatchupSide = matchup[alignment],
    dayStatus: GameStatus = GameDurationUtility.getDayStatus(matchup.day, day);


  if(side.profile.uid !== "") {
    const leader: boolean = MatchupUtility.getLeader(matchup) === side.profile.uid;
    
    const getLeaderLabel = (): JSX.Element => {
      if(leader) {        
        return (
          <Label 
            className="game-matchup-side-leader-label" 
            icon="fal fa-trophy" 
            styles={{ color: `rgb(${side.profile.color})`}}
            text={dayStatus === GameStatus.Completed ? "Winner" : "Leader"}
          />
        )
      }
    }

    const getBorderStyles = (): React.CSSProperties => {
      if(leader) {
        return {
          backgroundColor: `rgb(${side.profile.color})`
        }
      }
    }

    const getStyles = (): React.CSSProperties => {
      if(leader) {
        const { color } = side.profile;

        const background: string = alignment === MatchupSideAlignment.Left 
          ? `linear-gradient(to right, rgba(${color}, 0.15), transparent)`
          : `linear-gradient(to left, rgba(${color}, 0.15), transparent)`;

        const styles: React.CSSProperties = { background };

        return styles;
      }
    }

    const getName = (): JSX.Element => {
      if(side.profile.name) {
        return (
          <h1 className="game-matchup-side-name passion-one-font">{side.profile.name}</h1>     
        )
      }
    }

    const getBorder = (): JSX.Element => <div className="game-matchup-side-border" style={getBorderStyles()} />;

    return (
      <div className={classNames("game-matchup-side", props.alignment)}>
        {props.alignment === MatchupSideAlignment.Left ? getBorder() : null}
        <div className="game-matchup-side-content" style={getStyles()}>
          <ProfileIcon 
            color={side.profile.color}
            icon={side.profile.icon}
          />
          <h1 className="game-matchup-side-username passion-one-font" style={{ color: `rgb(${side.profile.color})` }}>{side.profile.username}</h1>     
          {getName()}
          <MatchupSideStats 
            alignment={props.alignment}
            odds={odds}
            side={side}
          />
          {getLeaderLabel()}
        </div>
        {props.alignment === MatchupSideAlignment.Right ? getBorder() : null}
      </div>
    )
  }

  const getText = (): string => game.status === GameStatus.Upcoming ? "Undetermined" : "Bye",
    getIcon = (): string => game.status === GameStatus.Upcoming ? "fal fa-question" : "fal fa-hand-scissors";  

  return (
    <div className="game-matchup-side undetermined">
      <div className="game-matchup-side-undetermined">
        <div className="game-matchup-side-content">
          <ProfileIcon color="230, 230, 230" icon={getIcon()} />
          <h1 className="game-matchup-side-username passion-one-font" style={{ color: "rgb(230, 230, 230)" }}>{getText()}</h1>     
        </div>
      </div>
    </div>
  );
}