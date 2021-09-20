import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { Nano } from "../../../stroll-utilities/nanoUtility";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { defaultMatchupSideTotal, IMatchup, IMatchupSide, matchupConverter } from "../../../stroll-models/matchup";
import { IMatchupPair } from "../../../stroll-models/matchupPair";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupPlayerReference } from "../../../stroll-models/matchupProfileReference";
import { IPlayer } from "../../../stroll-models/player";

import { MatchupLeader } from "../../../stroll-enums/matchupLeader";

interface IMatchupUtility {  
  calculateRatio: (left: IMatchupSide, right: IMatchupSide) => number;
  filterOutCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  filterOutPairs: (listOne: IMatchupPair[], listTwo: IMatchupPair[]) => IMatchupPair[];
  generateAllPairs: (numberOfPlayers: number) => IMatchupPair[];
  generateDayOnePairs: (numberOfPlayers: number) => IMatchupPair[];
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number) => IMatchupPairGroup[];
  getAdjustedPlayerCount: (numberOfPlayers: number) => number;
  getByID: (id: string, matchups: IMatchup[]) => IMatchup;
  getByPlayer: (playerID: string, matchups: IMatchup[]) => IMatchup;
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  getLeader: (matchup: IMatchup) => string;
  getSideByFavorite: (matchup: IMatchup, shouldGetFavorite: boolean) => IMatchupSide;
  getSpreadLeader: (matchup: IMatchup) => string;
  getMatchupRef: (gameID: string, matchupID?: string) => firebase.firestore.DocumentReference;
  getPlayerSteps: (playerID: string, matchup: IMatchup) => number;
  getWinnerRatio: (matchup: IMatchup) => number;
  mapCreate: (leftPlayerID: string, rightPlayerID: string, day: number) => IMatchup;
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]) => IMatchup[];
  mapPlayerReference: (matchup: IMatchup) => IMatchupPlayerReference;
}

export const MatchupUtility: IMatchupUtility = {   
  calculateRatio: (left: IMatchupSide, right: IMatchupSide): number => {
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
    return matchups.find((matchup: IMatchup) => matchup.left.playerID === playerID || matchup.right.playerID === playerID);
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
      leader = matchup.left.playerID;
    } else if (matchup.left.steps < matchup.right.steps) {
      leader = matchup.right.playerID;
    }

    return leader;
  },
  getSideByFavorite: (matchup: IMatchup, shouldGetFavorite: boolean): IMatchupSide => {
    if(matchup.favoriteID === "") {
      return null;
    } else if(shouldGetFavorite) {
      if(matchup.left.playerID === matchup.favoriteID) {
        return matchup.left;
      } else if (matchup.right.playerID === matchup.favoriteID) {
        return matchup.right;
      }
    } else {
      if(matchup.left.playerID !== matchup.favoriteID) {
        return matchup.left;
      } else if (matchup.right.playerID !== matchup.favoriteID) {
        return matchup.right;
      }
    }
  },
  getSpreadLeader: (matchup: IMatchup): string => {
    let leader: string = MatchupLeader.Tie;

    const favoriteSide: IMatchupSide = MatchupUtility.getSideByFavorite(matchup, true),
      underdogSide: IMatchupSide = MatchupUtility.getSideByFavorite(matchup, false);

    if(favoriteSide.steps - matchup.spread > underdogSide.steps) {
      leader = favoriteSide.playerID;
    } else if (underdogSide.steps + matchup.spread > favoriteSide.steps) {
      leader = underdogSide.playerID;
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
    if(playerID === matchup.left.playerID) {
      return matchup.left.steps;
    } else if (playerID === matchup.right.playerID) {
      return matchup.right.steps;
    }

    throw new Error(`Player [${playerID}] not found in matchup [${matchup.id}]. Left was [${matchup.left.playerID}], right was [${matchup.right.playerID}]`);
  },
  getWinnerRatio: (matchup: IMatchup): number => {
    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === matchup.left.playerID
        ? MatchupUtility.calculateRatio(matchup.left, matchup.right)
        : MatchupUtility.calculateRatio(matchup.right, matchup.left);
    }

    return 1;
  },
  mapCreate: (leftPlayerID: string, rightPlayerID: string, day: number): IMatchup => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      day,
      favoriteID: "",
      id: Nano.generate(22),
      left: {
        playerID: leftPlayerID,
        steps: 0,
        total: defaultMatchupSideTotal()
      },
      right: {
        playerID: rightPlayerID,
        steps: 0,
        total: defaultMatchupSideTotal()
      },
      spread: 0,
      spreadCreatedAt: null,
      spreadWinner: "",
      winner: ""
    }
  },
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]): IMatchup[] => {
    players = players.map((player: IPlayer, index: number) => ({ ...player, index }));

    let matchups: IMatchup[] = [];

    groups.forEach((group: IMatchupPairGroup) => {
      group.pairs.forEach((pair: IMatchupPair) => {
        const left: IPlayer = players.find((player: IPlayer) => player.index === pair.left - 1),
          right: IPlayer = players.find((player: IPlayer) => player.index === pair.right - 1);

        const leftID: string = left ? left.id : "",
          rightID: string = right ? right.id : "";

        matchups.push(MatchupUtility.mapCreate(leftID, rightID, group.day));
      });
    });

    return matchups;
  },
  mapPlayerReference: (matchup: IMatchup): IMatchupPlayerReference => {
    return {
      id: matchup.id,
      leftPlayerID: matchup.left.playerID,
      rightPlayerID: matchup.right.playerID
    }
  }
}