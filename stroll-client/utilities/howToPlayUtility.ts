import { defaultMatchup, IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { defaultProfileReference } from "../../stroll-models/profileReference";

import { Color } from "../../stroll-enums/color";
import { HowToPlayID } from "../enums/howToPlayID";
import { Icon } from "../../stroll-enums/icon";
import { MatchupSideAlignment } from "../pages/gamePage/components/matchupSide/matchupSide";

interface IHowToPlayUtility {
  getExampleMatchup: () => IMatchup;  
  getExampleMatchupSide: (side: MatchupSideAlignment) => IMatchupSide;  
  getID: (id: string) => HowToPlayID;
}

export const HowToPlayUtility: IHowToPlayUtility = {
  getExampleMatchup: (): IMatchup => {
    return {
      ...defaultMatchup(),
      day: 1,
      left: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Left),
      right: HowToPlayUtility.getExampleMatchupSide(MatchupSideAlignment.Right)
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