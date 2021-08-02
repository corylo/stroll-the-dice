import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface NotificationsPageProps {
  
}

export const ShopPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState } = useContext(AppContext);

  return(
    <Page 
      id="shop-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.Shopping)} 
      requireAuth
    >     
      <PageTitle text="Shop" />      
    </Page>
  )
}