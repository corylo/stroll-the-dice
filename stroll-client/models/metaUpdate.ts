export interface IMetaUpdate {
  description: string;
  title: string;
}

export const defaultMetaUpdate = (): IMetaUpdate => ({
  title: "Stroll The Dice", 
  description: "Stroll The Dice is the combination of a stepping competition and a prediction game rolled into one. Play FREE with up to 20 friends per game. Earn points by taking steps and predicting matchup winners. Have the most points at the end of the game and you win!"
});