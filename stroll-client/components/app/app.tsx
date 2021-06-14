import React, { useReducer } from "react";
import { Route, Switch, useLocation } from "react-router";

import { HomePage } from "../../pages/homePage/homePage";

import { Navbar } from "../navbar/navbar";

import { AppContext } from "./contexts/appContext";

import { appReducer } from "./reducers/appReducer";

import { useScrollToTopEffect } from "../../effects/appEffects";
import { useAuthStateChangedEffect } from "../../effects/userEffects";

import { defaultAppState } from "./models/appState";

import { AppAction } from "../../enums/appAction";

interface AppProps {}

export const App: React.FC<AppProps> = (props: AppProps) => {
  const [appState, dispatchToApp] = useReducer(appReducer, defaultAppState());

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const location: any = useLocation();

  useScrollToTopEffect(location);

  useAuthStateChangedEffect(appState, dispatch);
  
  return (
    <AppContext.Provider value={{ appState, dispatchToApp }}>
      <div id="stroll-the-dice-app">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </AppContext.Provider>
  )
}