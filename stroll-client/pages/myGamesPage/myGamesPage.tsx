import React from "react";

import { Page } from "../../components/page/page";

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic=""
      requireAuth
    >    
    
    </Page>
  )
}