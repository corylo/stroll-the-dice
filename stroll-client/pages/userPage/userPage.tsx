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

import { Graphic } from "../../../stroll-enums/graphic";
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

  const id: string = UrlUtility.getParam(match, "id");

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

  useEffect(() => {
    if(user && user.profile.id === id) {
      setState({ ...state, profile: user.profile });
    }
  }, [user]);

  return(
    <Page 
      id="user-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.CityWalk)}
      requireAuth
      status={state.status} 
    >    
      <ProfileHeader profile={state.profile} /> 
    </Page>
  )
}