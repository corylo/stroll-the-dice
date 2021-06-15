import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState } = useContext(AppContext);

  const { status, user } = appState;

  const getContent = (): JSX.Element => {
    if(status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <ProfileHeader profile={user.profile} />
        </React.Fragment>
      )
    }
  }

  return(
    <Page id="profile-page" backgroundGraphic={ImageUtility.getGraphic(Graphic.CityWalk)} requireAuth>   
      {getContent()}
    </Page>
  )
}