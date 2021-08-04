import firebase from "firebase/app";

import { IProfileReference } from "./profileReference";

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
  profile?: IProfileReference;  
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
  id: string;  
  left: IMatchupSide;
  right: IMatchupSide;
  winner: string;
}

export const defaultMatchup = (): IMatchup => ({    
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  day: 0,
  id: "",
  left: defaultMatchupSide(),
  right: defaultMatchupSide(),
  winner: ""
});

export const matchupConverter: any = {
  toFirestore(matchup: IMatchup): firebase.firestore.DocumentData {
    return {
      createdAt: matchup.createdAt,     
      day: matchup.day, 
      left: matchup.left,
      right: matchup.right,
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
      id: snapshot.id,
      left: data.left,
      right: data.right,
      winner: data.winner
    }
  }
}