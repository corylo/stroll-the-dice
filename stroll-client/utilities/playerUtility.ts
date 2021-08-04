import firebase from "firebase/app";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { defaultPlayer, IPlayer } from "../../stroll-models/player";
import { IProfile } from "../../stroll-models/profile";
import { IUser } from "../models/user";

import { InitialValue } from "../../stroll-enums/initialValue";

interface IPlayerUtility {
  getById: (id: string, players: IPlayer[]) => IPlayer;
  getByUser: (user: IUser, players: IPlayer[]) => IPlayer;  
  hasProfileChanged: (before: IPlayer, after: IPlayer) => boolean;
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite) => IPlayer;
}

export const PlayerUtility: IPlayerUtility = {
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
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite): IPlayer => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: profile.uid,      
      index: 0,
      points: {
        available: InitialValue.PlayerPoints,
        total: InitialValue.PlayerPoints
      },
      profile: {
        color: profile.color,
        icon: profile.icon,
        name: profile.name,
        uid: profile.uid,
        username: profile.username
      },
      ref: {
        game: game.id,
        gameStatus: game.status,
        invite: invite.id,
        lastMatchupPredicted: "",
        team: ""
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  }
}