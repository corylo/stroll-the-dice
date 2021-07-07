import firebase from "firebase-admin";

import { db } from "../../firebase";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { defaultMatchupSideTotal, IMatchup, IMatchupSide, matchupConverter } from "../../../stroll-models/matchup";
import { IMatchupPair } from "../../../stroll-models/matchupPair";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";

import { MatchupLeader } from "../../../stroll-enums/matchupLeader";

interface IMatchupUtility {  
  calculateOdds: (left: IMatchupSide, right: IMatchupSide) => number;
  filterOutCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  filterOutPairs: (listOne: IMatchupPair[], listTwo: IMatchupPair[]) => IMatchupPair[];
  findStepUpdate: (playerID: string, updates: IMatchupSideStepUpdate[]) => IMatchupSideStepUpdate;    
  generateAllPairs: (numberOfPlayers: number) => IMatchupPair[];
  generateDayOnePairs: (numberOfPlayers: number) => IMatchupPair[];
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number) => IMatchupPairGroup[];
  getAdjustedPlayerCount: (numberOfPlayers: number) => number;
  getByID: (id: string, matchups: IMatchup[]) => IMatchup;
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  getLeader: (matchup: IMatchup) => string;
  getMatchupRef: (gameID: string, matchupID?: string) => firebase.firestore.DocumentReference;
  getWinnerOdds: (matchup: IMatchup) => number;
  mapCreate: (leftID: string, rightID: string, day: number) => IMatchup;
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]) => IMatchup[];
  mapStepUpdates: (matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => IMatchup[];  
  setWinners: (matchups: IMatchup[]) => IMatchup[];
}

export const MatchupUtility: IMatchupUtility = {   
  calculateOdds: (left: IMatchupSide, right: IMatchupSide): number => {
    if(left.total.wagered !== 0 && right.total.wagered !== 0) {
      return (left.total.wagered + right.total.wagered) / left.total.wagered;
    }

    return 1;
  },
  filterOutCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]): IMatchupPair[] => {
    return list.filter((listPair: IMatchupPair) => (
      listPair.left !== pair.left &&
      listPair.left !== pair.right &&
      listPair.right !== pair.left &&
      listPair.right !== pair.right
    ));
  },
  filterOutPairs: (listOne: IMatchupPair[], listTwo: IMatchupPair[]): IMatchupPair[] => {    
    return listOne.filter((listOnePair: IMatchupPair) => {
      const match: IMatchupPair = listTwo.find((listTwoPair: IMatchupPair) => 
        `${listTwoPair.left}${listTwoPair.right}` === `${listOnePair.left}${listOnePair.right}`);

      return match === undefined;
    });
  },
  findStepUpdate: (playerID: string, updates: IMatchupSideStepUpdate[]): IMatchupSideStepUpdate => {
    const match: IMatchupSideStepUpdate = updates.find((update: IMatchupSideStepUpdate) => update.id === playerID);

    return match || null;
  },
  generateAllPairs: (numberOfPlayers: number): IMatchupPair[] => {
    const count: number = MatchupUtility.getAdjustedPlayerCount(numberOfPlayers);

    let pairs: IMatchupPair[] = []; 

    for(let i: number = 1; i <= count; i++) {
      for(let j: number = i + 1; j <= count; j++) {
        pairs.push({ left: i, right: j });
      }
    }

    return pairs;
  },
  generateDayOnePairs: (numberOfPlayers: number): IMatchupPair[] => {
    const count: number = MatchupUtility.getAdjustedPlayerCount(numberOfPlayers);

    let pairs: IMatchupPair[] = [];

    for(let i: number = 1; i <= count; i+=2) {
      pairs.push({ left: i, right: i + 1 });
    }

    return pairs;
  },
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number): IMatchupPairGroup[] => {      
    numberOfPlayers = MatchupUtility.getAdjustedPlayerCount(numberOfPlayers);
    
    const groups: IMatchupPairGroup[] = [],
      allPossiblePairs: IMatchupPair[] = MatchupUtility.generateAllPairs(numberOfPlayers),
      dayOnePairs: IMatchupPair[] = MatchupUtility.generateDayOnePairs(numberOfPlayers),
      dayTwoPossiblePairs: IMatchupPair[] = MatchupUtility.filterOutPairs(allPossiblePairs, dayOnePairs);

    let possiblePairs: IMatchupPair[] = dayTwoPossiblePairs;

    for(let i: number = 2; i <= numberOfDays; i++) {    
      let selectedPairs: IMatchupPair[] = [],
        unselectedPairs: IMatchupPair[] = [];

      while(possiblePairs.length > 0) {
        const rand: number = NumberUtility.random(0, possiblePairs.length - 1),
          selectedPair: IMatchupPair = possiblePairs[rand];

        selectedPairs = [...selectedPairs, selectedPair];
        
        possiblePairs = [...possiblePairs.filter((pair: IMatchupPair, index: number) => index !== rand)];

        unselectedPairs = [...unselectedPairs, ...MatchupUtility.getCombinationsOfPair(selectedPair, possiblePairs)];

        possiblePairs = MatchupUtility.filterOutCombinationsOfPair(selectedPair, possiblePairs);  
      }

      if(unselectedPairs.length !== 0) {
        possiblePairs = unselectedPairs;
      } else {
        possiblePairs = allPossiblePairs;
      }

      if(selectedPairs.length === (numberOfPlayers / 2)) {
        groups.push({ day: i, pairs: selectedPairs });
      } else {
        --i;
      }
    }

    return groups;
  },
  getAdjustedPlayerCount: (numberOfPlayers: number): number => {
    return numberOfPlayers % 2 === 0 
      ? numberOfPlayers 
      : numberOfPlayers + 1;
  },
  getByID: (id: string, matchups: IMatchup[]): IMatchup => {
    return matchups.find((matchup: IMatchup) => matchup.id === id);
  },
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]): IMatchupPair[] => {
    return list.filter((listPair: IMatchupPair) => (
      listPair.left === pair.left ||
      listPair.left === pair.right ||
      listPair.right === pair.left ||
      listPair.right === pair.right
    ));
  },
  getLeader: (matchup: IMatchup): string => {
    let leader: string = MatchupLeader.Tie;

    if(matchup.left.steps > matchup.right.steps) {
      leader = matchup.left.ref;
    } else if (matchup.left.steps < matchup.right.steps) {
      leader = matchup.right.ref;
    }

    return leader;
  },
  getMatchupRef: (gameID: string, matchupID?: string): firebase.firestore.DocumentReference => {
    return db.collection("games")
      .doc(gameID)
      .collection("matchups")
      .withConverter<IMatchup>(matchupConverter)
      .doc(matchupID || null);
  },
  getWinnerOdds: (matchup: IMatchup): number => {
    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === matchup.left.ref
        ? MatchupUtility.calculateOdds(matchup.left, matchup.right)
        : MatchupUtility.calculateOdds(matchup.right, matchup.left);
    }

    return 1;
  },
  mapCreate: (leftID: string, rightID: string, day: number): IMatchup => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      day,
      id: "",
      left: {
        ref: leftID,
        steps: 0,
        total: defaultMatchupSideTotal()
      },
      right: {
        ref: rightID,
        steps: 0,
        total: defaultMatchupSideTotal()
      },
      winner: ""
    }
  },
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]): IMatchup[] => {
    players = players.map((player: IPlayer, index: number) => ({ ...player, index }));

    let matchups: IMatchup[] = [];

    groups.forEach((group: IMatchupPairGroup) => {
      group.pairs.forEach((pair: IMatchupPair) => {
        const left: IPlayer = players.find((player: IPlayer) => player.index === pair.left - 1),
          right: IPlayer = players.find((player: IPlayer) => player.index === pair.right - 1),
          leftID: string = left ? left.id : "",
          rightID: string = right ? right.id : "";

        matchups.push(MatchupUtility.mapCreate(leftID, rightID, group.day));
      });
    });

    return matchups;
  },
  mapStepUpdates: (matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): IMatchup[] => {
    return matchups.map((matchup: IMatchup) => {
      const leftUpdate: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(matchup.left.ref, updates),
        rightUpdate: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(matchup.right.ref, updates);

      if(leftUpdate) {
        matchup.left.steps += leftUpdate.steps;
      }

      if(rightUpdate) {
        matchup.right.steps += rightUpdate.steps;
      }

      return matchup;
    });
  },
  setWinners: (matchups: IMatchup[]): IMatchup[] => {
    return matchups.map((matchup: IMatchup) => {
      if(matchup.left.ref !== "" && matchup.right.ref !== "") {
        matchup.winner = MatchupUtility.getLeader(matchup);
      }

      return matchup;
    });
  }
}