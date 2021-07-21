import firebase from "firebase-admin";

import { db } from "../../firebase";

import { Nano } from "../../../stroll-utilities/nanoUtility";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { defaultMatchupSideTotal, IMatchup, IMatchupSide, IMatchupSideTotal, matchupConverter } from "../../../stroll-models/matchup";
import { IMatchupPair } from "../../../stroll-models/matchupPair";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupProfileReference } from "../../../stroll-models/matchupProfileReference";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";
import { defaultProfileReference, IProfileReference } from "../../../stroll-models/profileReference";

import { InitialValue } from "../../../stroll-enums/initialValue";
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
  getByPlayer: (playerID: string, matchups: IMatchup[]) => IMatchup;
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  getLeader: (matchup: IMatchup) => string;
  getMatchupRef: (gameID: string, matchupID?: string) => firebase.firestore.DocumentReference;
  getPlayerSteps: (playerID: string, matchup: IMatchup) => number;
  getWinnerOdds: (matchup: IMatchup) => number;
  mapCreate: (leftProfile: IProfileReference, rightProfile: IProfileReference, day: number, total?: IMatchupSideTotal) => IMatchup;
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]) => IMatchup[];
  mapProfileReference: (matchup: IMatchup) => IMatchupProfileReference;
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
  getByPlayer: (playerID: string, matchups: IMatchup[]): IMatchup => {
    return matchups.find((matchup: IMatchup) => matchup.left.profile.uid === playerID || matchup.right.profile.uid === playerID);
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
      leader = matchup.left.profile.uid;
    } else if (matchup.left.steps < matchup.right.steps) {
      leader = matchup.right.profile.uid;
    }

    return leader;
  },
  getMatchupRef: (gameID: string, matchupID?: string): firebase.firestore.DocumentReference => {
    if(matchupID) {
      return db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .withConverter<IMatchup>(matchupConverter)
        .doc(matchupID);
    }

    return db.collection("games")
      .doc(gameID)
      .collection("matchups")
      .withConverter<IMatchup>(matchupConverter)
      .doc();
  },
  getPlayerSteps: (playerID: string, matchup: IMatchup): number => {
    if(playerID === matchup.left.profile.uid) {
      return matchup.left.steps;
    } else if (playerID === matchup.right.profile.uid) {
      return matchup.right.steps;
    }

    throw new Error(`Player [${playerID}] not found in matchup [${matchup.id}]. Left was [${matchup.left.profile.uid}], right was [${matchup.right.profile.uid}]`);
  },
  getWinnerOdds: (matchup: IMatchup): number => {
    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === matchup.left.profile.uid
        ? MatchupUtility.calculateOdds(matchup.left, matchup.right)
        : MatchupUtility.calculateOdds(matchup.right, matchup.left);
    }

    return 1;
  },
  mapCreate: (leftProfile: IProfileReference, rightProfile: IProfileReference, day: number, total?: IMatchupSideTotal): IMatchup => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      day,
      id: Nano.generate(22),
      left: {
        profile: leftProfile,
        steps: 0,
        total: total || defaultMatchupSideTotal()
      },
      right: {
        profile: rightProfile,
        steps: 0,
        total: total || defaultMatchupSideTotal()
      },
      winner: ""
    }
  },
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]): IMatchup[] => {
    players = players.map((player: IPlayer, index: number) => ({ ...player, index }));

    let matchups: IMatchup[] = [];

    const getTotal = (leftProfile: IProfileReference, rightProfile: IProfileReference): IMatchupSideTotal => {
      if(leftProfile.uid !== "" && rightProfile.uid !== "") {
        return {
          participants: 1,
          wagered: InitialValue.InitialPredictionPoints
        };
      }
    }
    
    groups.forEach((group: IMatchupPairGroup) => {
      group.pairs.forEach((pair: IMatchupPair) => {
        const left: IPlayer = players.find((player: IPlayer) => player.index === pair.left - 1),
          right: IPlayer = players.find((player: IPlayer) => player.index === pair.right - 1),
          leftProfile: IProfileReference = left ? left.profile : defaultProfileReference(),
          rightProfile: IProfileReference = right ? right.profile : defaultProfileReference();


        matchups.push(MatchupUtility.mapCreate(leftProfile, rightProfile, group.day, getTotal(leftProfile, rightProfile)));
      });
    });

    return matchups;
  },
  mapProfileReference: (matchup: IMatchup): IMatchupProfileReference => {
    return {
      id: matchup.id,
      left: matchup.left.profile,
      right: matchup.right.profile
    }
  },
  mapStepUpdates: (matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): IMatchup[] => {
    return matchups.map((matchup: IMatchup) => {
      const leftUpdate: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(matchup.left.profile.uid, updates),
        rightUpdate: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(matchup.right.profile.uid, updates);

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
      if(matchup.left.profile.uid !== "" && matchup.right.profile.uid !== "") {
        matchup.winner = MatchupUtility.getLeader(matchup);
      }

      return matchup;
    });
  }
}