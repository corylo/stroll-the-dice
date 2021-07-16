export enum GameEventType {
  Completed = "Game Completed", // ✔
  Created = "Game Created", // ✔
  DayCompleted = "Day Completed", // ✔
  Started = "Game Started", // ✔
  Updated = "Game Updated", // ✔

  PlayerCreated = "Player Created", // ✔
  PlayerCreatedPrediction = "Player Created Prediction", // ✔
  PlayerDayCompletedSummary = "Player Day Completed Summary", // ✔
  PlayerEarnedPointsFromSteps = "Player Earned Points From Steps", // ✔
  PlayerUpdatedPrediction = "Player Updated Prediction", // ✔

  Unknown = ""
}