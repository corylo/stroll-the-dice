import { FirestoreDateUtility } from "../../stroll-utilities/firestoreDateUtility";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";
import { defaultProfile } from "../../stroll-models/profile";
import { defaultProfileReference } from "../../stroll-models/profileReference";

import { Color } from "../../stroll-enums/color";
import { GameStatus } from "../../stroll-enums/gameStatus";
import { HowToPlayID } from "../enums/howToPlayID";
import { Icon } from "../../stroll-enums/icon";
import { MatchupSideAlignment } from "../pages/gamePage/components/matchupSide/matchupSide";

interface IHowToPlayUtility {
  getExampleMatchup: () => IMatchup;  
  getExampleMatchupSide: (side: MatchupSideAlignment) => IMatchupSide;  
  getExamplePlayer: () => IPlayer;
  getID: (id: string) => HowToPlayID;
}

export const HowToPlayUtility: IHowToPlayUtility = {
  getExampleMatchup: (): IMatchup => {
    return {
      createdAt: FirestoreDateUtility.dateToTimestamp(new Date()),
      day: 1,
      favoriteID: "",
      id: "",
      left: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Left),
      right: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Right),
      spread: 0,
      spreadCreatedAt: FirestoreDateUtility.dateToTimestamp(new Date()),
      winner: ""
    }
  },
  getExampleMatchupSide: (side: MatchupSideAlignment): IMatchupSide => {
    if(side === MatchupSideAlignment.Left) {
      return {
        playerID: "123",
        profile: {
          ...defaultProfileReference(),
          color: Color.Orange2,
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
      playerID: "234",
      profile: {
        ...defaultProfileReference(),
        color: Color.Yellow1,
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
      place: 0,
      points: {
        available: 1000,
        total: 1000
      },
      profile: {
        ...defaultProfile(),
        color: Color.Purple1,
        icon: Icon.Rudolph,
        username: "Player 1"
      },
      ref: {
        acceptedGiftDays: false,
        game: "",
        gameStatus: GameStatus.Unknown,
        invite: "",
        lastMatchupPredicted: "",
        team: ""
      },
      steps: 0,
      updatedAt: FirestoreDateUtility.dateToTimestamp(new Date())
    }
  },
  getID: (id: string): HowToPlayID => {
    switch(id) {
      case HowToPlayID.HowItWorks:
        return HowToPlayID.HowItWorks;        
        
      case HowToPlayID.Matchups:
        return HowToPlayID.Matchups;        
        
      case HowToPlayID.Predictions:
        return HowToPlayID.Predictions;        
        
      case HowToPlayID.Prerequisites:
        return HowToPlayID.Prerequisites;        
        
      case HowToPlayID.TheGoal:
        return HowToPlayID.TheGoal;        
        
      case HowToPlayID.GettingStarted:
      default:
        return HowToPlayID.GettingStarted;
    }
  }
}