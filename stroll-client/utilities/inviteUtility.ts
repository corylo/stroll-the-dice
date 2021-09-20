import firebase from "firebase/app";

import { DateUtility } from "../../stroll-utilities/dateUtility";
import { Nano } from "../../stroll-utilities/nanoUtility";
import { UrlUtility } from "./urlUtility";

import { IInvite } from "../../stroll-models/invite";
import { IProfile } from "../../stroll-models/profile";

import { InitialValue } from "../../stroll-enums/initialValue";
import { PlayerStatus } from "../../stroll-enums/playerStatus";

interface IInviteUtility {
  getLink: (gameID: string, inviteID: string) => string;
  mapCreate: () => IInvite;
  showInvite: (id: string, creator: IProfile, playerStatus: PlayerStatus) => boolean;
}

export const InviteUtility: IInviteUtility = {
  getLink: (gameID: string, inviteID: string): string => {
    return UrlUtility.getLink(`/game/${gameID}?invite=${inviteID}`);
  },
  mapCreate: (): IInvite => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      duration: DateUtility.daysToMillis(365),
      id: Nano.generate(5),
      uses: {
        current: 0,
        max: InitialValue.MaxInviteUses
      }
    }
  },
  showInvite: (id: string, creator: IProfile, playerStatus: PlayerStatus): boolean => {
    return (
      id !== null && 
      creator.uid !== "" && 
      playerStatus === PlayerStatus.NotPlaying
    );
  }
}