import firebase from "firebase-admin";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { defaultMatchupSideTotal, IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPair } from "../../../stroll-models/matchupPair";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IPlayer } from "../../../stroll-models/player";

interface IMatchupUtility {  
  filterOutCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  filterOutPairs: (listOne: IMatchupPair[], listTwo: IMatchupPair[]) => IMatchupPair[];
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]) => IMatchupPair[];
  getAdjustedPlayerCount: (numberOfPlayers: number) => number;
  generateAllPairs: (numberOfPlayers: number) => IMatchupPair[];
  generateDayOnePairs: (numberOfPlayers: number) => IMatchupPair[];
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number) => IMatchupPairGroup[];
  mapCreate: (leftID: string, rightID: string, day: number) => IMatchup;
  mapMatchupsFromPairGroups: (groups: IMatchupPairGroup[], players: IPlayer[]) => IMatchup[];
}

export const MatchupUtility: IMatchupUtility = {   
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
  getCombinationsOfPair: (pair: IMatchupPair, list: IMatchupPair[]): IMatchupPair[] => {
    return list.filter((listPair: IMatchupPair) => (
      listPair.left === pair.left ||
      listPair.left === pair.right ||
      listPair.right === pair.left ||
      listPair.right === pair.right
    ));
  },
  getAdjustedPlayerCount: (numberOfPlayers: number): number => {
    return numberOfPlayers % 2 === 0 
      ? numberOfPlayers 
      : numberOfPlayers + 1;
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
  }
}