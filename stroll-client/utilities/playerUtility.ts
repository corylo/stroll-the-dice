import firebase from "firebase/app";
import { IGame } from "../../stroll-models/game";

import { IInvite } from "../../stroll-models/invite";
import { IPlayer } from "../../stroll-models/player";
import { IProfile } from "../../stroll-models/profile";
import { IUser } from "../models/user";

interface IPlayerUtility {
  getById: (id: string, players: IPlayer[]) => IPlayer;
  getByUser: (user: IUser, players: IPlayer[]) => IPlayer;
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite) => IPlayer;
}

export const PlayerUtility: IPlayerUtility = {
  getById: (id: string, players: IPlayer[]): IPlayer => {
    return players.find((player: IPlayer) => player.id === id) || null;
  },
  getByUser: (user: IUser, players: IPlayer[]): IPlayer => {
    if(user && user.profile) {      
      return PlayerUtility.getById(user.profile.uid, players);
    }

    return null;
  },
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite): IPlayer => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      funds: 1000,
      id: profile.uid,      
      index: 0,
      profile,
      ref: {
        game: game.id,
        invite: invite.id,
        lastMatchupPredicted: "",
        team: ""
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  }
}