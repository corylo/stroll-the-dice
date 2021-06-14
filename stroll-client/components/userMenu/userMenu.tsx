import React, { useContext } from "react";

import { AppContext } from "../app/contexts/appContext";

import { UserMenuModal } from "./userMenuModal";

interface UserMenuProps {
  
}

export const UserMenu: React.FC<UserMenuProps> = (props: UserMenuProps) => {  
  const { appState } = useContext(AppContext);

  if(appState.toggles.menu) {
    return (
      <UserMenuModal />
    )
  }

  return null;
}