import { FirestoreDateUtility } from "../../../../stroll-utilities/firestoreDateUtility";

import { IMatchup, IMatchupSide } from "../../../../stroll-models/matchup";
import { IPlayer } from "../../../../stroll-models/player";

import { Color } from "../../../../stroll-enums/color";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { Icon } from "../../../../stroll-enums/icon";
import { MatchupSideAlignment } from "../../gamePage/components/matchupSide/matchupSide";

interface IHowToPlayUtility {
  getExampleMatchup: () => IMatchup;  
  getExampleMatchupSide: (side: MatchupSideAlignment) => IMatchupSide;  
  getExamplePlayer: () => IPlayer;
}

export const HowToPlayUtility: IHowToPlayUtility = {
  getExampleMatchup: (): IMatchup => {
    return {
      createdAt: FirestoreDateUtility.dateToTimestamp(new Date),
      day: 1,
      id: "",
      left: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Left),
      right: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Right),
      winner: ""
    }
  },
  getExampleMatchupSide: (side: MatchupSideAlignment): IMatchupSide => {
    if(side === MatchupSideAlignment.Left) {
      return {
        profile: {
          color: Color.Orange3,
          icon: Icon.Dog,
          uid: "123",
          username: "Player 1"
        },
        steps: 0,
        total: {
          participants: 2,
          wagered: 5000
        }
      }
    }

    return {
      profile: {
        color: Color.Yellow2,
        icon: Icon.Squirrel,
        uid: "234",
        username: "Player 2"
      },
      steps: 0,
      total: {
        participants: 2,
        wagered: 2500
      }
    }
  },
  getExamplePlayer: (): IPlayer => {
    return {
      id: "000",
      createdAt: FirestoreDateUtility.dateToTimestamp(new Date()),
      index: 0,
      points: {
        available: 1000,
        total: 1000
      },
      profile: {
        color: Color.Purple3,
        icon: Icon.Rudolph,
        uid: "",
        username: "Player 1"
      },
      ref: {
        game: "",
        gameStatus: GameStatus.Unknown,
        invite: "",
        lastMatchupPredicted: "",
        team: ""
      },
      updatedAt: FirestoreDateUtility.dateToTimestamp(new Date())
    }
  }
}