export enum GameEventType {
  Created = "Game Created",
  Updated = "Game Updated",
  Started = "Game Started",
  DayCompleted = "Day Completed",
  Completed = "Game Completed",

  PlayerCreated = "Player Created",
  PlayerCreatedPrediction = "Player Created Prediction",
  PlayerUpdatedPrediction = "Player Updated Prediction",
  PlayerEarnedPointsFromSteps = "Player Earned Points From Steps",  
  PlayerEarnedPointsFromCorrectPrediction = "Player Earned Points From Correct Prediction",
  PlayerLostPointsFromIncorrectPrediction = "Player Lost Points From Incorrect Prediction",

  Unknown = ""
}