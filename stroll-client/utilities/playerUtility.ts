import firebase from "firebase/app";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { defaultPlayer, IPlayer } from "../../stroll-models/player";
import { IProfile, placeholderProfile } from "../../stroll-models/profile";
import { IUser } from "../models/user";

import { InitialValue } from "../../stroll-enums/initialValue";

interface IPlayerUtility {
  determineLeaderboardPlace: (place: number) => string;
  getById: (id: string, players: IPlayer[]) => IPlayer;
  getByUser: (user: IUser, players: IPlayer[]) => IPlayer;  
  hasProfileChanged: (before: IPlayer, after: IPlayer) => boolean;
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite, acceptedGiftDays: boolean) => IPlayer;
  mapPlaceholderProfiles: (players: IPlayer[]) => IPlayer[];
  mapProfiles: (players: IPlayer[], profiles: IProfile[]) => IPlayer[];
}

export const PlayerUtility: IPlayerUtility = {
  determineLeaderboardPlace: (place: number): string => {
    const x: number = place % 10,
      y: number = place % 100;

    if (x === 1 && y !== 11) {
      return `${place}st`;
    } else if (x === 2 && y !== 12) {
      return  `${place}nd`;
    } else if (x === 3 && y !== 13) {
      return `${place}rd`;
    }

    return `${place}th`;
  },
  getById: (id: string, players: IPlayer[]): IPlayer => {
    return players.find((player: IPlayer) => player.id === id) || defaultPlayer();
  },
  getByUser: (user: IUser, players: IPlayer[]): IPlayer => {
    if(user && user.profile) {      
      return PlayerUtility.getById(user.profile.uid, players);
    }

    return defaultPlayer();
  },
  hasProfileChanged: (before: IPlayer, after: IPlayer): boolean => {
    return (
      before.profile.color !== after.profile.color ||
      before.profile.icon !== after.profile.icon ||
      before.profile.name !== after.profile.name ||
      before.profile.username !== after.profile.username
    )
  },
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite, acceptedGiftDays: boolean): IPlayer => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: profile.uid,      
      index: 0,
      points: {
        available: InitialValue.PlayerPoints,
        total: InitialValue.PlayerPoints
      },
      place: 0,
      ref: {
        acceptedGiftDays,
        game: game.id,
        gameStatus: game.status,
        invite: invite.id,
        lastMatchupPredicted: "",
        team: ""
      },
      steps: 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  },
  mapPlaceholderProfiles: (players: IPlayer[]): IPlayer[] => {
    return players.map((player: IPlayer) => ({
      ...player,
      profile: placeholderProfile()
    }))
  },
  mapProfiles: (players: IPlayer[], profiles: IProfile[]): IPlayer[] => {
    return players.map((player: IPlayer) => {
      const profile: IProfile = profiles.find((p: IProfile) => p.uid === player.id);

      if(profile) {
        player.profile = profile;
      }

      return player;
    });
  }
}