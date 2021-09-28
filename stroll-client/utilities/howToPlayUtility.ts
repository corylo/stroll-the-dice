import { FirestoreDateUtility } from "../../stroll-utilities/firestoreDateUtility";
import { Nano } from "../../stroll-utilities/nanoUtility";
import { NumberUtility } from "../../stroll-utilities/numberUtility";

import { defaultMatchup, IMatchup } from "../../stroll-models/matchup";
import { defaultPlayer, IPlayer } from "../../stroll-models/player";
import { defaultProfile, IProfile } from "../../stroll-models/profile";

import { Color } from "../../stroll-enums/color";
import { HowToPlayID } from "../enums/howToPlayID";
import { Icon } from "../../stroll-enums/icon";

interface IIconExperiencePair {
  experience: number;
  icon: Icon;
}

interface IHowToPlayUtility {
  generateRandomExampleMatchup: () => IMatchup;
  getExamplePlayers: (size: number) => IPlayer[];
  getExampleProfile: (username: string, color: Color, icon: Icon, experience: number) => IProfile;
  getExampleProfiles: (size: number) => IProfile[];
  getID: (id: string) => HowToPlayID;
}

export const HowToPlayUtility: IHowToPlayUtility = {
  generateRandomExampleMatchup: (): IMatchup => {
    const matchup: IMatchup = defaultMatchup();

    const profiles: IProfile[] = HowToPlayUtility.getExampleProfiles(2);

    const favorite: IProfile = profiles[NumberUtility.random(0, 1)];

    matchup.day = 1;

    matchup.favoriteID = favorite.uid;
    matchup.spreadCreatedAt = FirestoreDateUtility.dateToTimestamp(new Date());

    matchup.left.playerID = profiles[0].uid;
    matchup.left.profile = profiles[0];
    matchup.left.steps = NumberUtility.random(2000, 9999);      
    matchup.left.total.wagered = NumberUtility.random(20000, 40000);   
    matchup.left.total.participants = NumberUtility.random(5, 10);     

    matchup.right.playerID = profiles[1].uid;
    matchup.right.profile = profiles[1];
    matchup.right.steps = NumberUtility.random(matchup.left.steps - 1000, matchup.left.steps + 1000);
    matchup.right.total.wagered = NumberUtility.random(20000, 40000);     
    matchup.right.total.participants = NumberUtility.random(5, 10);
    
    matchup.favoriteID = NumberUtility.random(1, 2) % 2 === 0 ? matchup.left.playerID : matchup.right.playerID;
    matchup.spread = NumberUtility.random(2000, 5000);

    return matchup;
  },
  getExamplePlayers: (size: number): IPlayer[] => {
    const profiles: IProfile[] = HowToPlayUtility.getExampleProfiles(3);

    return profiles.map((profile: IProfile) => {
      return {
        ...defaultPlayer(),
        profile,
        points: {
          available: 0,
          total: NumberUtility.random(10000, 50000)
        }
      }
    })
  },
  getExampleProfile: (username: string, color: Color, icon: Icon, experience: number): IProfile => {
    return {
      ...defaultProfile(),
      color,
      experience,
      icon,
      uid: Nano.generate(),
      username
    }
  },
  getExampleProfiles: (size: number): IProfile[] => {
    let iconExperiencePairs: IIconExperiencePair[] = [
      { experience: 75000, icon: Icon.CheeseBurger },
      { experience: 200000, icon: Icon.Quidditch },
      { experience: 1500000, icon: Icon.BattleAxe },
      { experience: 4000000, icon: Icon.Starship },
      { experience: 11000000, icon: Icon.SantaHat }
    ]

    let descriptors: string[] = ["Flying", "Swimming", "Running", "Strolling", "Walking"],
      items: string[] = ["Ninja", "Monkey", "Badger", "Duck", "Panda"],
      colors: Color[] = [Color.Red1, Color.Orange1, Color.Yellow1, Color.Green1, Color.Blue1];

    if(size > descriptors.length) {
      throw new Error(`Limit of ${descriptors.length} example profiles.`);
    }
  
    let profiles: IProfile[] = [];

    for(let i = 0; i < size; i++) {
      const descriptor1: string = descriptors[NumberUtility.random(0, descriptors.length - 1)],
        item1: string = items[NumberUtility.random(0, items.length - 1)],
        color1: Color = colors[NumberUtility.random(0, colors.length - 1)],      
        iconExperiencePair1: IIconExperiencePair = iconExperiencePairs[NumberUtility.random(0, iconExperiencePairs.length - 1)];
        
      descriptors = descriptors.filter((descriptor: string) => descriptor !== descriptor1);
      items = items.filter((item: string) => item !== item1);
      colors = colors.filter((color: Color) => color !== color1);
      iconExperiencePairs = iconExperiencePairs.filter((pair: IIconExperiencePair) => pair.experience !== iconExperiencePair1.experience);

      profiles.push(HowToPlayUtility.getExampleProfile(
        `${descriptor1} ${item1}`, 
        color1, 
        iconExperiencePair1.icon, 
        iconExperiencePair1.experience)
      );
    }

    return profiles;
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