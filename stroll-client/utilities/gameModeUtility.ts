import { GameMode } from "../../stroll-enums/gameMode";

interface IGameModeUtility {
  getIcon: (mode: GameMode) => string;
  getModes: () => GameMode[];
}

export const GameModeUtility: IGameModeUtility = {
  getIcon: (mode: GameMode): string => {
    switch(mode) {
      case GameMode.Singles:
        return "fal fa-user";
      case GameMode.Duos:
        return "fal fa-user-friends";
      case GameMode.Quads:
        return "fal fa-users";
      default:
        throw new Error(`Unknown game mode: ${mode}`);
    }
  },
  getModes: (): GameMode[] => {
    return [
      GameMode.Singles,
      GameMode.Duos,
      GameMode.Quads
    ]
  }
}