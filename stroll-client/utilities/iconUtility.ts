import { IIconTier } from "../../stroll-models/iconTier";

import { Icon } from "../../stroll-enums/icon";

interface IIconUtility {
  getUserIconsByTier: (tierNumber: number) => IIconTier;
  getUserIconTiers: () => IIconTier[];
}

export const IconUtility: IIconUtility = {
  getUserIconsByTier: (tierNumber: number): IIconTier => {
    switch(tierNumber) {
      case 1:
        return {
          icons: [
            Icon.Bat,
            Icon.Cat,
            Icon.Dog,
            Icon.Dragon,
            Icon.Duck,
            Icon.Elephant,
            Icon.Kiwi,
            Icon.Monkey,
            Icon.Narwhal,
            Icon.Pegasus,
            Icon.Pig,
            Icon.Rabbit,
            Icon.Rudolph,
            Icon.Squirrel,
            Icon.Turtle
          ],
          minimumLevel: 1,
          tierNumber: 1
        }
    }
  },
  getUserIconTiers: (): IIconTier[] => {
    let tiers: IIconTier[] = [];

    for(let i: number = 1; i < 2; i++) {
      tiers.push(IconUtility.getUserIconsByTier(i));
    }

    return tiers;
  }
}