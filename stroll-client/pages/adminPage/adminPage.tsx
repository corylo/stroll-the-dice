import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { AdminSection } from "./components/adminSection/adminSection";
import { GiftGameDaysInput } from "./components/giftGameDaysInput/giftGameDaysInput";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { AppContext } from "../../components/app/contexts/appContext";

import { RoleUtility } from "../../../stroll-utilities/roleUtility";

import { AppStatus } from "../../enums/appStatus";

interface AdminPageProps {
  
}

export const AdminPage: React.FC<AdminPageProps> = (props: AdminPageProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState;
  
  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.Loading) {
      return null;
    }
    
    if(appState.status === AppStatus.SignedIn && RoleUtility.isAdmin(user.roles)) {
      return (
        <React.Fragment>
          <PageTitle text="Admin" />
          <AdminSection title="Gift Game Days">          
            <GiftGameDaysInput />
          </AdminSection>
        </React.Fragment>  
      )
    }

    return (
      <Redirect to="/" />
    )
  }

  return (    
    <Page id="admin-page" backgroundGraphic="">     
      {getContent()}
    </Page>
  )
}