import firebase from "firebase-admin";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { IGame } from "../../../stroll-models/game";
import { INotification } from "../../../stroll-models/notification";

interface INotificationUtility {
  getRandomGoodLuckStatement: () => string;
  mapCreate: (text: string | string[], title: string, occurredAt: firebase.firestore.FieldValue, url?: string) => INotification;
  mapDayCompleteNotification: (game: IGame, day: number, dayCompletedAt: firebase.firestore.FieldValue) => INotification;
  mapGameCompleteNotification: (game: IGame) => INotification;
  mapGameStartedNotification: (game: IGame) => INotification;
}

export const NotificationUtility: INotificationUtility = {
  getRandomGoodLuckStatement: (): string => {
    const rand: number = NumberUtility.random(0, 3);

    switch(rand) {
      case 0:
        return "Good luck and have fun 😀.";
      case 1:
        return "You're gonna do great 🥇.";
      case 2:
        return "We believe in you 👍.";
      case 3:
      default:
        return "Thanks for playing 🙌.";
    }
  },
  mapCreate: (text: string | string[], title: string, occurredAt: firebase.firestore.FieldValue, url?: string): INotification => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      occurredAt,
      text,
      title,
      url: url || "",
      viewedAt: null
    }
  },
  mapDayCompleteNotification: (game: IGame, day: number, dayCompletedAt: firebase.firestore.FieldValue): INotification => {
    return NotificationUtility.mapCreate([
        `Day ${day} of ${game.duration} is complete!`,
        `Day ${day + 1} predictions will close in 1hr.`
      ],
      `Day ${day} of ${game.name} is complete!`,
      dayCompletedAt,
      `game/${game.id}`
    );
  },
  mapGameCompleteNotification: (game: IGame): INotification => {
    return NotificationUtility.mapCreate([
        "Game results are available now.",
        "Thanks for playing!"
      ],
      `${game.name} is complete!`,
      game.endsAt,
      `game/${game.id}`
    );
  },
  mapGameStartedNotification: (game: IGame): INotification => {
    return NotificationUtility.mapCreate([
        "It's time to get strolling.",
        "Day 1 predictions will close in 1hr.",
        NotificationUtility.getRandomGoodLuckStatement()
      ],
      `${game.name} has started!`,
      game.startsAt,
      `game/${game.id}`
    );
  }
}