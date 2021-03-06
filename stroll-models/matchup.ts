import firebase from "firebase/app";

import { IProfile } from "./profile";

export interface IMatchupSideTotal {
  participants: number;
  wagered: number;
}

export const defaultMatchupSideTotal = (): IMatchupSideTotal => ({
  participants: 0,
  wagered: 0
});

export interface IMatchupSide {    
  playerID: string;
  profile?: IProfile;  
  steps: number;
  total: IMatchupSideTotal;
}

export const defaultMatchupSide = (): IMatchupSide => ({  
  playerID: "",  
  steps: 0,
  total: defaultMatchupSideTotal()
});

export interface IMatchup {  
  createdAt: firebase.firestore.FieldValue;  
  day: number;
  favoriteID: string;
  id: string;  
  left: IMatchupSide;
  right: IMatchupSide;
  spread: number;
  spreadCreatedAt: firebase.firestore.FieldValue;
  spreadWinner: string;
  winner: string;
}

export const defaultMatchup = (): IMatchup => ({    
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  day: 0,
  favoriteID: "",
  id: "",
  left: defaultMatchupSide(),
  right: defaultMatchupSide(),
  spread: 0,
  spreadCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  spreadWinner: "",
  winner: ""
});

export const matchupConverter: any = {
  toFirestore(matchup: IMatchup): firebase.firestore.DocumentData {
    return {
      createdAt: matchup.createdAt,     
      day: matchup.day, 
      favoriteID: matchup.favoriteID,
      left: matchup.left,
      right: matchup.right,
      spread: matchup.spread,
      spreadCreatedAt: matchup.spreadCreatedAt,
      spreadWinner: matchup.spreadWinner,
      winner: matchup.winner
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IMatchup>
  ): IMatchup {
    const data: IMatchup = snapshot.data();

    return {
      createdAt: data.createdAt,      
      day: data.day,
      favoriteID: data.favoriteID,
      id: snapshot.id,
      left: data.left,
      right: data.right,
      spread: data.spread,
      spreadCreatedAt: data.spreadCreatedAt,
      spreadWinner: data.spreadWinner,
      winner: data.winner
    }
  }
}