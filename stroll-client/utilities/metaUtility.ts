import { UrlUtility } from "./urlUtility";

import { IGame } from "../../stroll-models/game";
import { defaultMetaUpdate, IMetaUpdate } from "../models/metaUpdate";
import { IProfile } from "../../stroll-models/profile";

interface IMetaUtility {
  getAttribute: (name: string, qualifier?: string) => string;
  getContactUsPageMeta: () => IMetaUpdate;
  getCreateGamePageMeta: () => IMetaUpdate;
  getFriendsPageMeta: () => IMetaUpdate;
  getGamePageMeta: (game: IGame, creator: IProfile) => IMetaUpdate;
  getHomePageMeta: () => IMetaUpdate;
  getMyGamesPageMeta: () => IMetaUpdate;
  getMyGameDaysPageMeta: () => IMetaUpdate;
  getNotificationsPageMeta: () => IMetaUpdate;
  getProfilePageMeta: () => IMetaUpdate;
  getShopPageMeta: () => IMetaUpdate;
  getStatsPageMeta: () => IMetaUpdate;
  updateRoute: (update: IMetaUpdate) => void;
  setAttribute: (name: string, value: string, qualifier?: string) => void;
}

export const MetaUtility: IMetaUtility = {
  getAttribute: (name: string, qualifier?: string): string => {
    return (document.querySelector(`meta[${qualifier || "property"}=\"${name}\"]`) as HTMLMetaElement).content;
  },
  getContactUsPageMeta: (): IMetaUpdate => {
    return {
      title: "Contact Us | Stroll The Dice",
      description: "For any questions, feedback, or assistance you may need with the site."
    }
  },
  getFriendsPageMeta: (): IMetaUpdate => {    
    return {
      title: "Friends | Stroll The Dice",
      description: "View and manage my friends!"
    }
  },
  getCreateGamePageMeta: (): IMetaUpdate => {    
    return {
      title: "Create Game | Stroll The Dice",
      description: "Create a new game and invite anyone you'd like to play!"
    }
  },
  getGamePageMeta: (game: IGame, creator: IProfile): IMetaUpdate => {
    const update: IMetaUpdate = defaultMetaUpdate();

    if(game.name && creator.uid) {
      const invite: string | null = UrlUtility.getQueryParam("invite");

      if(invite) {
        update.title = `You're invited to ${game.name} | Stroll The Dice`;
        update.description = `You've been invited to play in ${game.name} created by ${creator.username}.`;
      } else {
        update.title = `${game.name} | Stroll The Dice`;
        update.description = `You're playing in ${game.name} created by ${creator.username}.`;
      }
    }

    return update;
  },
  getHomePageMeta: (): IMetaUpdate => {
    return defaultMetaUpdate();
  },
  getMyGameDaysPageMeta: (): IMetaUpdate => {
    return {
      title: "My Game Days | Stroll The Dice",
      description: "See how many game days you have as well as your game day usage history."
    }
  },
  getMyGamesPageMeta: (): IMetaUpdate => {
    return {
      title: "My Games | Stroll The Dice",
      description: "View my games. You can filter by hosting or joined. You can also filter by status: upcoming, in progress, and completed."
    }
  },
  getNotificationsPageMeta: (): IMetaUpdate => {
    return {
      title: "Notifications | Stroll The Dice",
      description: "View important notifications regarding my profile, games, and other useful info."
    }
  },
  getProfilePageMeta: (): IMetaUpdate => {
    return {
      title: "Profile | Stroll The Dice",
      description: "Manage my profile, step trackers, and other settings."
    }
  },
  getShopPageMeta: (): IMetaUpdate => {
    return {
      title: "Shop | Stroll The Dice",
      description: "Purchase Game Days for creating and joining games."
    }
  },
  getStatsPageMeta: (): IMetaUpdate => {
    return {
      title: "Stats | Stroll The Dice",
      description: "View my profile stats. Includes my level, experience, steps per day, and other useful info."
    }
  },
  updateRoute: (update: IMetaUpdate): void => {    
    if(update.title !== "" && update.description !== "") {
      if(document.title !== update.title) {
        document.title = update.title;
        MetaUtility.setAttribute("og:title", update.title);
        MetaUtility.setAttribute("twitter:title", update.title, "name");
      }
      
      if(MetaUtility.getAttribute("description", "name") !== update.description) {
        MetaUtility.setAttribute("description", update.description, "name");
        MetaUtility.setAttribute("og:description", update.description);
        MetaUtility.setAttribute("twitter:description", update.description, "name");
      }

      if(MetaUtility.getAttribute("og:url") !== window.location.href) {
        MetaUtility.setAttribute("og:url", window.location.href);
      }
    }
  },
  setAttribute: (name: string, value: string, qualifier?: string): void => {
    document.querySelector(`meta[${qualifier || "property"}=\"${name}\"]`).setAttribute("content", value);
  }
}