import React, { useReducer } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";

import { AdminPage } from "../../pages/adminPage/adminPage";
import { ContactUsPage } from "../../pages/contactUsPage/contactUsPage";
import { CookieBanner } from "../cookieBanner/cookieBanner";
import { CreateGamePage } from "../../pages/createGamePage/createGamePage";
import { FriendsPage } from "../../pages/friendsPage/friendsPage";
import { GamePage } from "../../pages/gamePage/gamePage";
import { GoodbyePage } from "../../pages/goodbyePage/goodbyePage";
import { HomePage } from "../../pages/homePage/homePage";
import { HowToPlayPage } from "../../pages/howToPlayPage/howToPlayPage";
import { MyGamesPage } from "../../pages/myGamesPage/myGamesPage";
import { NotificationsPage } from "../../pages/notificationsPage/notificationsPage";
import { ProfilePage } from "../../pages/profilePage/profilePage";
import { ShopPage } from "../../pages/shopPage/shopPage";
import { StatsPage } from "../../pages/statsPage/statsPage";
import { UserPage } from "../../pages/userPage/userPage";

import { DeleteAccountModal } from "../deleteAccountModal/deleteAccountModal";
import { HowToPlayModal } from "../howToPlayModal/howToPlayModal";
import { Nav } from "../nav/nav";
import { Navbar } from "../navbar/navbar";
import { SignInModal } from "../signInModal/signInModal";
import { UpdateProfileModal } from "../updateProfileModal/updateProfileModal";
import { UserMenuModal } from "../userMenu/userMenuModal";

import { AppContext } from "./contexts/appContext";

import { appReducer } from "./reducers/appReducer";

import { useFirebaseAnalyticsInitializerEffect, useScrollToTopEffect } from "../../effects/appEffects";
import { useAuthStateChangedEffect, useGameDaysListenerEffect, useNotificationsListenerEffect } from "../../effects/userEffects";

import { defaultAppState } from "./models/appState";

import { AppAction } from "../../enums/appAction";
import { MyGameDaysPage } from "../../pages/myGameDaysPage/myGameDaysPage";

interface AppProps {}

export const App: React.FC<AppProps> = (props: AppProps) => {
  const [appState, dispatchToApp] = useReducer(appReducer, defaultAppState());

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const location: any = useLocation();

  useScrollToTopEffect(location);

  useAuthStateChangedEffect(appState, dispatch);

  useGameDaysListenerEffect(appState, dispatch);

  useNotificationsListenerEffect(appState, dispatch);

  useFirebaseAnalyticsInitializerEffect(appState);

  return (
    <AppContext.Provider value={{ appState, dispatchToApp }}>
      <div id="stroll-the-dice-app">
        <Navbar />
        <Nav />
        <SignInModal />
        <UserMenuModal />
        <UpdateProfileModal />
        <HowToPlayModal />
        <DeleteAccountModal />
        <CookieBanner />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path={["/profile", "/profile/connect/:tracker"]}>
            <ProfilePage />
          </Route>
          <Route exact path="/profile/game-days">
            <MyGameDaysPage />
          </Route>
          <Route exact path="/stats">
            <StatsPage />
          </Route>
          <Route exact path="/u/:id">
            <UserPage />
          </Route>
          <Route exact path="/friends">
            <FriendsPage />
          </Route>
          <Route exact path="/create">
            <CreateGamePage />
          </Route>
          <Route exact path="/games">
            <MyGamesPage />
          </Route>
          <Route exact path="/game/:id">
            <GamePage />
          </Route>
          <Route exact path="/notifications">
            <NotificationsPage />
          </Route>
          <Route exact path="/shop">
            <ShopPage />
          </Route>
          <Route exact path="/how-to-play">
            <HowToPlayPage />
          </Route>
          <Route exact path="/contact-us">
            <ContactUsPage />
          </Route>
          <Route exact path="/goodbye">
            <GoodbyePage />
          </Route>
          <Route exact path="/admin">
            <AdminPage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </AppContext.Provider>
  )
}