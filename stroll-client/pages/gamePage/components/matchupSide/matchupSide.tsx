import React, { useContext } from "react";
import classNames from "classnames";

import { Label } from "../../../../components/label/label";
import { PlayerLevelBadge } from "../../../../components/playerLevelBadge/playerLevelBadge";
import { ProfileIcon } from "../../../../components/profileIcon/profileIcon";

import { GamePageContext } from "../../gamePage";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { MatchupSideStats } from "../matchupSideStats/matchupSideStats";
import { MatchupLeader } from "../../../../../stroll-enums/matchupLeader";

export enum MatchupSideAlignment {
  Left = "left",
  Right = "right"
}

interface MatchupSideProps {  
  alignment: MatchupSideAlignment;
  matchup: IMatchup;
  ratio: number;
}

export const MatchupSide: React.FC<MatchupSideProps> = (props: MatchupSideProps) => {  
  const { day, game } = useContext(GamePageContext).state;

  const { alignment, matchup, ratio } = props;
  
  const side: IMatchupSide = matchup[alignment];

  if(side.playerID !== "") {
    const dayStatus: GameStatus = GameDurationUtility.getDayStatus(matchup.day, day);

    const isWinner: boolean = matchup.winner === side.playerID,    
      isLeader: boolean = MatchupUtility.getLeader(matchup) === side.playerID,
      isTied: boolean = matchup.winner === MatchupLeader.Tie || matchup.left.steps === matchup.right.steps;
    
    const getLeaderLabel = (): JSX.Element => {
      if(dayStatus !== GameStatus.Upcoming) {
        const getText = (): string => {
          if(isWinner) {
            return "Winner";
          } else if(isLeader) {
            return "Leader";
          }

          return "Tied";
        }

        const getStyles = (): React.CSSProperties => {
          const styles: React.CSSProperties = {};
          
          if(isWinner || isLeader) {
            styles.color = `rgb(${side.profile.color})`;
          } else {
            styles.color = "white";
          }

          return styles;
        }

        if(isWinner || isLeader || isTied) {
          return (
            <Label 
              className="game-matchup-side-leader-label" 
              icon="fal fa-trophy" 
              styles={getStyles()}
              text={getText()}
            />
          );
        }
      }
    }

    const getBorderStyles = (): React.CSSProperties => {
      if(isLeader) {
        return {
          backgroundColor: `rgb(${side.profile.color})`
        }
      }
    }

    const getStyles = (): React.CSSProperties => {
      if(isLeader) {
        const { color } = side.profile;

        const background: string = alignment === MatchupSideAlignment.Left 
          ? `linear-gradient(to right, rgba(${color}, 0.25), transparent)`
          : `linear-gradient(to left, rgba(${color}, 0.25), transparent)`;

        const styles: React.CSSProperties = { background };

        return styles;
      }
    }

    const getBorder = (): JSX.Element => <div className="game-matchup-side-border" style={getBorderStyles()} />;

    return (
      <div className={classNames("game-matchup-side", props.alignment)}>
        {props.alignment === MatchupSideAlignment.Left ? getBorder() : null}
        <div className="game-matchup-side-content" style={getStyles()}>
          <div className="game-matchup-side-player-icon">
            <ProfileIcon 
              color={side.profile.color}
              icon={side.profile.icon}
            />            
            <PlayerLevelBadge 
              color={side.profile.color} 
              experience={side.profile.experience} 
              inline
              mini 
            />
          </div>
          <div className="game-matchup-side-username-wrapper">
            <h1 className="game-matchup-side-username passion-one-font" style={{ color: `rgb(${side.profile.color})` }}>{side.profile.username}</h1>          
          </div>
          <h1 className="game-matchup-side-name passion-one-font">{side.profile.name}</h1>   
          <MatchupSideStats 
            alignment={props.alignment}
            favoriteID={matchup.favoriteID}
            ratio={ratio}
            side={side}
            spread={matchup.spread}
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
      <div className="game-matchup-side-content">
        <ProfileIcon color="230, 230, 230" icon={getIcon()} />
        <h1 className="game-matchup-side-username passion-one-font" style={{ color: "rgb(230, 230, 230)" }}>{getText()}</h1>               
      </div>
    </div>
  );
}