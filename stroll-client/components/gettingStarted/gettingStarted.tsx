import React, { useContext } from "react";
import { useHistory } from "react-router";

import { GettingStartedStep } from "./gettingStartedStep";

import { AppContext } from "../app/contexts/appContext";

import { GettingStartedUtility } from "./utilities/gettingStartedUtility";
import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";

interface GettingStartedProps {  
  hasCreatedOrJoinedGame: boolean;
}

export const GettingStarted: React.FC<GettingStartedProps> = (props: GettingStartedProps) => {   
  const { appState, dispatchToApp } = useContext(AppContext);

  const { user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const history: any = useHistory();

  if(GettingStartedUtility.showGettingStarted(user.profile, props.hasCreatedOrJoinedGame)) {
    return (
      <div className="getting-started">
        <div className="getting-started-background" style={{ backgroundImage: `url(${ImageUtility.getGraphic("park", "png")})`}}/>
        <div className="getting-started-content">
          <h1 className="getting-started-label passion-one-font">Getting Started</h1>
          <h1 className="getting-started-description passion-one-font">Complete these steps so you can get strolling!</h1>
          <div className="getting-started-steps">
            <GettingStartedStep 
              completed={GettingStartedUtility.hasCompletedProfileCustomizationStep(user.profile)} 
              index={1} 
              label="Customize your profile" 
              handleOnAction={() => dispatch(AppAction.ToggleUpdateProfile, true)}
            />
            <GettingStartedStep 
              completed={GettingStartedUtility.hasCompletedStepTrackerConnectionStep(user.profile.tracker)} 
              index={2} 
              label="Connect a step tracker"
              handleOnAction={() => history.push("/profile")}
            />
            <GettingStartedStep 
              completed={props.hasCreatedOrJoinedGame} 
              index={3} 
              label="Create or join a game" 
              handleOnAction={() => history.push("/create")}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}