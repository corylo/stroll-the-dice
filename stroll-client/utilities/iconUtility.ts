import { IIconTier } from "../../stroll-models/iconTier";

import { Icon } from "../../stroll-enums/icon";

enum IconTier {
  Min = 1,
  Max = 8
}
interface IIconUtility {
  getUserIconsByTier: (tierNumber: number) => IIconTier;
  getUserIconTiers: () => IIconTier[];
  mapIconTier: (tierNumber: number, minimumLevel: number, icons: Icon[]) => IIconTier;
}

export const IconUtility: IIconUtility = {
  getUserIconsByTier: (tierNumber: number): IIconTier => {
    switch(tierNumber) {
      case 1:
        return IconUtility.mapIconTier(tierNumber, 1, [
          Icon.Cat,
          Icon.Dog,
          Icon.Duck,
          Icon.Kiwi,
          Icon.Pig
        ]);
      case 2:
        return IconUtility.mapIconTier(tierNumber, 2, [
          Icon.Bat,
          Icon.Dragon,
          Icon.Elephant,
          Icon.Monkey,
          Icon.Narwhal,
          Icon.Pegasus,
          Icon.Rabbit,
          Icon.Rudolph,
          Icon.Squirrel,
          Icon.Turtle
        ]);
      case 3:
        return IconUtility.mapIconTier(tierNumber, 5, [
          Icon.Baseball,
          Icon.Basketball,
          Icon.Bowling,
          Icon.Boxing,
          Icon.Dumbell,
          Icon.Football,
          Icon.FootballHelmet,
          Icon.Futbol,
          Icon.GolfBall,
          Icon.GolfClub,
          Icon.HockeySticks,
          Icon.IceSkate,
          Icon.Quidditch,
          Icon.TableTennis,
          Icon.Volleyball
        ]);
      case 4:
        return IconUtility.mapIconTier(tierNumber, 10, [
          Icon.Anchor,
          Icon.Axe,
          Icon.Binoculars,
          Icon.BowAndArrow,
          Icon.Chess,
          Icon.Drum,
          Icon.Gamepad,
          Icon.Guitar,
          Icon.Headset,
          Icon.Mace,
          Icon.PaintBrush,
          Icon.Puzzle,
          Icon.Scythe,
          Icon.Shield,
          Icon.Swords
        ]);
      case 5:
        return IconUtility.mapIconTier(tierNumber, 30, [
          Icon.Dizzy,
          Icon.Grin,
          Icon.GrinBeam,
          Icon.GrinHearts,
          Icon.GrinTears,
          Icon.GrinWink,
          Icon.KissWinkHeart,
          Icon.Laugh,
          Icon.Poo,
          Icon.Smile
        ]);
      case 6:
        return IconUtility.mapIconTier(tierNumber, 50, [
          Icon.Biking,
          Icon.Cowboy,
          Icon.Detective,
          Icon.Doctor,
          Icon.Graduate,
          Icon.Hiking,
          Icon.Ninja,
          Icon.Snowboarding,
          Icon.Suit,
          Icon.Swimming
        ]);
      case 7:
        return IconUtility.mapIconTier(tierNumber, 70, [
          Icon.AlienMonster,
          Icon.Astronaut,
          Icon.CatSpace,
          Icon.Drone,
          Icon.PoliceBox,
          Icon.Raygun,
          Icon.Robot,
          Icon.Rocket,
          Icon.StarshipFreighter,
          Icon.Ufo          
        ]);
      case 8:
        return IconUtility.mapIconTier(tierNumber, 90, [
          Icon.BattleHelmet,
          Icon.ChefHat,
          Icon.SantaHat,
          Icon.WitchHat,
          Icon.WizardHat
        ]);
    }
  },
  getUserIconTiers: (): IIconTier[] => {
    let tiers: IIconTier[] = [];

    for(let i: number = IconTier.Min; i <= IconTier.Max; i++) {
      tiers.push(IconUtility.getUserIconsByTier(i));
    }

    return tiers;
  },
  mapIconTier: (tierNumber: number, minimumLevel: number, icons: Icon[]): IIconTier => {
    return {
      icons,
      minimumLevel,
      tierNumber
    }
  }
}