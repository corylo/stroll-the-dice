import React from "react";

import { Leaderboard } from "../leaderboard/leaderboard";

import { GamePageContext } from "../../pages/gamePage/gamePage";

import { HowToPlayUtility } from "../../utilities/howToPlayUtility";

import { defaultGame, IGame } from "../../../stroll-models/game";
import { defaultGamePageState, IGamePageState } from "../../pages/gamePage/models/gamePageState";
import { IPlayer } from "../../../stroll-models/player";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

interface ExampleLeaderboardProps {  
  
}

export const ExampleLeaderboard: React.FC<ExampleLeaderboardProps> = (props: ExampleLeaderboardProps) => {    
  const game: IGame = {
    ...defaultGame(),
    duration: 1,
    startsAt: FirestoreDateUtility.dateToTimestamp(new Date())
  }

  game.progressUpdateAt = FirestoreDateUtility.addMillis(game.startsAt, 24 * 3600 * 1000);

  const state: IGamePageState = { 
    ...defaultGamePageState(), 
    day: 1,
    game,
    statuses: {
      game: RequestStatus.Success,
      player: PlayerStatus.Playing,  
      players: RequestStatus.Success
    }
  };
      
  const players: IPlayer[] = HowToPlayUtility.getExamplePlayers(3);

  return (
    <GamePageContext.Provider value={{ state, setState: () => {}}}>
      <div className="example-leaderboard-wrapper">
        <Leaderboard
          id="game-page-content-leaderboard"
          limit={3}
          players={players} 
          gameStatus={GameStatus.Completed} 
          toggleView={() => {}}
        />
      </div>
    </GamePageContext.Provider>
  )  
}