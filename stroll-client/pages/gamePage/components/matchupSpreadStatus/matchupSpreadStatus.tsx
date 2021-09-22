import React, { useContext } from "react";

import { IconButton } from "../../../../components/buttons/iconButton";
import { IconStatement } from "../../../../components/iconStatement/iconStatement";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IGame } from "../../../../../stroll-models/game";
import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";

import { AppAction } from "../../../../enums/appAction";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { HowToPlayID } from "../../../../enums/howToPlayID";
import { Icon } from "../../../../../stroll-enums/icon";

interface MatchupSpreadStatusProps {  
  dayStatus: GameStatus;
  game: IGame;
  matchup: IMatchup;
}

export const MatchupSpreadStatus: React.FC<MatchupSpreadStatusProps> = (props: MatchupSpreadStatusProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const { dayStatus, game, matchup } = props;
  
  const toggle = (): void => {    
    dispatch(AppAction.ToggleHowToPlay, { howToPlay: true, howToPlayID: HowToPlayID.Matchups });
  }

  if(matchup.right.playerID !== "") {
    const favoriteSide: IMatchupSide = MatchupUtility.getSideByFavorite(matchup, true),
      underdogSide: IMatchupSide = MatchupUtility.getSideByFavorite(matchup, false),
      favoritePlayerStatement: JSX.Element = <PlayerStatement profile={favoriteSide.profile} />,        
      spreadStatement: JSX.Element = <IconStatement icon={Icon.Steps} text={matchup.spread.toLocaleString()} />;

    const getBodyContent = (): JSX.Element => {      
      if(matchup.spreadCreatedAt === null) {
        return (
          <h1 className="matchup-spread-status-description passion-one-font">The spread has not been determined yet.</h1>
        )
      } else if (matchup.favoriteID === "") {
        return (
          <h1 className="matchup-spread-status-description passion-one-font">There is no favorite for this matchup since one or more players does not have enough step history yet.</h1>
        )
      }

      if(dayStatus === GameStatus.Upcoming) {
        return (
          <h1 className="matchup-spread-status-description passion-one-font">{favoritePlayerStatement} is favored in this matchup and must win by more than {spreadStatement} to cover the spread.</h1>
        )
      } else if (dayStatus === GameStatus.InProgress) {
        const relativeSpreadStatement: JSX.Element = <IconStatement icon={Icon.Steps} text={(underdogSide.steps + matchup.spread + 1).toLocaleString()} />;

        return (
          <h1 className="matchup-spread-status-description passion-one-font">{favoritePlayerStatement} is favored in this matchup and currently must take at least {relativeSpreadStatement} to cover the spread.</h1>
        )
      } else if (dayStatus === GameStatus.Completed) {
        if(FirestoreDateUtility.endOfDayProgressUpdateComplete(matchup.day, game.startsAt, game.progressUpdateAt)) {
          return (
            <h1 className="matchup-spread-status-description passion-one-font">Determining spread winner...</h1>
          )
        }

        const favoritePlayerWon: boolean = favoriteSide.playerID === matchup.spreadWinner;

        if(favoritePlayerWon) {
          return (
            <h1 className="matchup-spread-status-description passion-one-font">{favoritePlayerStatement} covered the spread of {spreadStatement} and is the spread winner!</h1>
          )
        }

        const underdogPlayerStatement: JSX.Element = <PlayerStatement profile={underdogSide.profile} />;

        return (
          <h1 className="matchup-spread-status-description passion-one-font">{favoritePlayerStatement} did not cover the spread of {spreadStatement}. This means {underdogPlayerStatement} is the spread winner!</h1>
        )
      }
    }

    const getSpreadStatusBar = (): JSX.Element => {
      if(dayStatus !== GameStatus.Upcoming) {
        const spreadCoverageDecimal: number = (favoriteSide.steps / (underdogSide.steps + matchup.spread + 1)),
          spreadCoveragePercentage: number = Math.min(100, spreadCoverageDecimal * 100);
        
        const spreadCoverageRoundedPercentage: string = (spreadCoveragePercentage === 0 || spreadCoveragePercentage === 100)
            ? spreadCoveragePercentage.toString()
            : spreadCoveragePercentage.toFixed(2);
        
        const favoriteStyles: React.CSSProperties = {
          backgroundColor: `rgb(${favoriteSide.profile.color})`,
          width: `${spreadCoveragePercentage}%`
        }

        const underdogStyles: React.CSSProperties = {
          backgroundColor: `rgb(${underdogSide.profile.color})`,
          width: `${(1 - spreadCoverageDecimal) * 100}%`
        }

        const getSpreadStatusBarPercentage = (): JSX.Element => {
          const styles: React.CSSProperties = { left: `${spreadCoveragePercentage}%` };

          if(spreadCoveragePercentage > 50) {
            return (
              <div className="matchup-spread-status-bar-percentage right-side" style={styles}>
                <h1 className="passion-one-font">{spreadCoverageRoundedPercentage}%</h1>
                <i className="player-level-badge-experience-bar-indicator fas fa-map-marker" />
              </div>
            )
          }

          return (
            <div className="matchup-spread-status-bar-percentage left-side" style={styles}>
              <i className="player-level-badge-experience-bar-indicator fas fa-map-marker" />
              <h1 className="passion-one-font">{spreadCoverageRoundedPercentage}%</h1>
            </div>
          )
        }

        return (        
          <div className="matchup-spread-status-bar">
            <div className="matchup-spread-status-bar-percentage-track">
              {getSpreadStatusBarPercentage()}
            </div>
            <div className="matchup-spread-status-bar-halves">
              <div className="matchup-spread-status-bar-half favorite" style={favoriteStyles} />
              <div className="matchup-spread-status-bar-half underdog" style={underdogStyles} />          
            </div>
          </div>
        )
      }
    }

    return (
      <div className="matchup-spread-status">
        <div className="matchup-spread-status-content">
          <div className="matchup-spread-status-label">
            <div className="matchup-spread-status-label-body">
              <i className={Icon.Spread} />
              <h1 className="passion-one-font">Spread</h1>
            </div>
            <IconButton
              icon="fal fa-info-circle"
              handleOnClick={toggle}
            />
          </div>
          <div className="matchup-spread-status-body">
            {getBodyContent()}
          </div>
        </div>
        {getSpreadStatusBar()}
      </div>
    );
  }

  return null;
}