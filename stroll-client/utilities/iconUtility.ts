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
          Icon.Apple,
          Icon.CandyCane,
          Icon.CandyCorn,
          Icon.Carrot,
          Icon.CheeseBurger,
          Icon.Cookie,
          Icon.Corn,
          Icon.Fries,
          Icon.GingerbreadMan,
          Icon.Hotdog,
          Icon.IceCream,
          Icon.Pie,
          Icon.Pizza,
          Icon.Popcorn,
          Icon.Taco
        ]);
      case 4:
        return IconUtility.mapIconTier(tierNumber, 10, [
          Icon.Baseball,
          Icon.Basketball,
          Icon.Bowling,
          Icon.Boxing,
          Icon.Dumbell,
          Icon.Football,
          Icon.FootballHelmet,
          Icon.Futbol,
          Icon.Gamepad,
          Icon.GolfBall,
          Icon.HockeySticks,
          Icon.IceSkate,
          Icon.Quidditch,
          Icon.TableTennis,
          Icon.Volleyball
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
          Icon.BattleAxe,
          Icon.BowAndArrow,
          Icon.Dagger,
          Icon.HammerWar,
          Icon.Mace,
          Icon.Scythe,
          Icon.Shield,
          Icon.Staff,
          Icon.Swords,
          Icon.Wand
        ]);
      case 7:
        return IconUtility.mapIconTier(tierNumber, 70, [
          Icon.Alien,
          Icon.AlienMonster,
          Icon.Astronaut,
          Icon.CatSpace,
          Icon.PoliceBox,
          Icon.Robot,
          Icon.Rocket,
          Icon.StarFighter,
          Icon.Starship,          
          Icon.StarshipFreighter
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