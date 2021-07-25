import React, { useReducer } from "react";
import { Route, Switch, useLocation } from "react-router";

import { CreateGamePage } from "../../pages/createGamePage/createGamePage";
import { GamePage } from "../../pages/gamePage/gamePage";
import { HomePage } from "../../pages/homePage/homePage";
import { HowToPlayPage } from "../../pages/howToPlayPage/howToPlayPage";
import { MyGamesPage } from "../../pages/myGamesPage/myGamesPage";
import { NotificationsPage } from "../../pages/notificationsPage/notificationsPage";
import { ProfilePage } from "../../pages/profilePage/profilePage";
import { UserPage } from "../../pages/userPage/userPage";

import { Nav } from "../nav/nav";
import { Navbar } from "../navbar/navbar";
import { SignInModal } from "../signInModal/signInModal";
import { UpdateProfileModal } from "../updateProfileModal/updateProfileModal";
import { UserMenuModal } from "../userMenu/userMenuModal";

import { AppContext } from "./contexts/appContext";

import { appReducer } from "./reducers/appReducer";

import { useCloseModalsEffect, useScrollToTopEffect } from "../../effects/appEffects";
import { useAuthStateChangedEffect } from "../../effects/userEffects";

import { defaultAppState } from "./models/appState";

import { AppAction } from "../../enums/appAction";

interface AppProps {}

export const App: React.FC<AppProps> = (props: AppProps) => {
  const [appState, dispatchToApp] = useReducer(appReducer, defaultAppState());

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const location: any = useLocation();

  useScrollToTopEffect(location);

  useCloseModalsEffect(location, appState, dispatch);

  useAuthStateChangedEffect(appState, dispatch);
  
  return (
    <AppContext.Provider value={{ appState, dispatchToApp }}>
      <div id="stroll-the-dice-app">
        <Navbar />
        <Nav />
        <SignInModal />
        <UserMenuModal />
        <UpdateProfileModal />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path={["/profile", "/profile/connect/:tracker"]}>
            <ProfilePage />
          </Route>
          <Route exact path={["/u/:id", "/u/:id/:username"]}>
            <UserPage />
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
          <Route exact path="/huh">
            <HowToPlayPage />
          </Route>
        </Switch>
      </div>
    </AppContext.Provider>
  )
}