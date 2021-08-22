import { IGameDayHistoryGiftEntry } from "../stroll-models/gameDayHistoryEntry/gameDayHistoryGiftEntry";
import { IGameDayHistoryPurchaseEntry } from "../stroll-models/gameDayHistoryEntry/gameDayHistoryPurchaseEntry";
import { IGameDayHistoryUseEntry } from "../stroll-models/gameDayHistoryEntry/gameDayHistoryUseEntry";

import { GameDayHistoryEntryType } from "../stroll-enums/gameDayHistoryEntryType";

interface IGameDayHistoryUtility {  
  mapFromFirestore: (id: string, entry: any) => any;
  mapToFirestore: (entry: any) => any;
}

export const GameDayHistoryUtility: IGameDayHistoryUtility = {  
  mapFromFirestore: (id: string, entry: any): any => {
    const from: any = GameDayHistoryUtility.mapToFirestore(event);
    
    from.id = id;

    return from;
  },
  mapToFirestore: (unidentifiedEntry: any) => {
    const to: any = {
      occurredAt: unidentifiedEntry.occurredAt,
      quantity: unidentifiedEntry.quantity,
      type: unidentifiedEntry.type
    }

    if(unidentifiedEntry.type === GameDayHistoryEntryType.Purchase) {
      const entry: IGameDayHistoryPurchaseEntry = unidentifiedEntry;

      to.paymentID = entry.paymentID;
    } else if(unidentifiedEntry.type === GameDayHistoryEntryType.Use) {
      const entry: IGameDayHistoryUseEntry = unidentifiedEntry;

      to.usedBy = entry.usedBy;
    } else if(unidentifiedEntry.type === GameDayHistoryEntryType.Gift) {
      const entry: IGameDayHistoryGiftEntry = unidentifiedEntry;

      to.from = entry.from;
      to.to = entry.to;
    }

    return to;
  }
}