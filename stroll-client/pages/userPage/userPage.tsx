import React, { useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";

import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";

import { AppContext } from "../../components/app/contexts/appContext";

import { ProfileService } from "../../services/profileService";

import { ImageUtility } from "../../utilities/imageUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { IProfile } from "../../../stroll-models/profile";
import { defaultUserPageState, IUserPageState } from "./models/userPageState";

import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface UserPageProps {
  
}

export const UserPage: React.FC<UserPageProps> = (props: UserPageProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const match: any = useRouteMatch(),
    history: any = useHistory();
  
  const [state, setState] = useState<IUserPageState>(defaultUserPageState());

  useEffect(() => {
    if(state.status === RequestStatus.Success && match.path !== "/u/:id/:username") {      
      history.replace(`/u/${state.profile.id}/${UrlUtility.format(state.profile.username)}`);
    }
  }, [state.profile]);

  const getID = (): string => {
    if(match && match.params && match.params.id) {
      return match.params.id;
    } 

    return "";
  }

  const id: string = getID();

  useEffect(() => {
    const fetch = async (): Promise<void> => {

      try {
        let profile: IProfile = null;

        if(user && user.profile.id === id) {
          profile = user.profile;
        } else {
          profile = await ProfileService.get.by.id(id);
        }          

        setState({ profile, status: RequestStatus.Success });        
      } catch (err) {
        console.error(err);
        
        setState({ ...state, status: RequestStatus.Error });
      }
    }

    fetch();
  }, []);

  return(
    <Page id="user-page" status={state.status} backgroundGraphic={ImageUtility.getGraphic("city-walk")}>    
      <ProfileHeader profile={state.profile} /> 
    </Page>
  )
}