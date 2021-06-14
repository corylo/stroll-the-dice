import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";

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
    <Page id="profile-page" requireAuth>   
      {getContent()}
    </Page>
  )
}