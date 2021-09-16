import React, { useContext, useState } from "react";

import { IconButton } from "../buttons/iconButton";
import { UserLink } from "../userLink/userLink";

import { AppContext } from "../app/contexts/appContext";

import { FriendService } from "../../services/friendService";

import { IFriend } from "../../../stroll-models/friend";

import { RequestStatus } from "../../../stroll-enums/requestStatus";
import { TooltipSide } from "../tooltip/tooltip";
import { Button } from "../buttons/button";

interface IFriendStateToggles {
  confirmRemoval: boolean;
  viewOptions: boolean;
}

const defaultFriendStateToggles = (): IFriendStateToggles => ({
  confirmRemoval: false,
  viewOptions: false
})

interface IFriendState {  
  status: RequestStatus;
  toggles: IFriendStateToggles;
}

const defaultFriendState = (): IFriendState => ({   
  status: RequestStatus.Idle,
  toggles: defaultFriendStateToggles()
});

interface FriendProps {  
  friend: IFriend;  
  handleOnRemove: () => void;
}

export const Friend: React.FC<FriendProps> = (props: FriendProps) => {  
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [state, setState] = useState<IFriendState>(defaultFriendState());

  const updateToggles = (toggles: any): void => {
    setState({ ...state, toggles: { ...state.toggles, ...toggles }});
  }

  const cancel = (): void => setState(defaultFriendState());      

  const getActions = (): JSX.Element => {
    if(state.status === RequestStatus.Loading) {    
      return (      
        <div className="loading-spinner">
          <i className="fal fa-spinner-third" />
        </div>
      );
    } else if (state.toggles.viewOptions) {  
      return (
        <React.Fragment>   
          <Button className="passion-one-font" handleOnClick={() => updateToggles({ confirmRemoval: true, viewOptions: false })}>
            Delete
          </Button>
          <Button className="passion-one-font" handleOnClick={cancel}>
            Cancel
          </Button>
        </React.Fragment>
      )
    } else if (state.toggles.confirmRemoval) {
      const remove = async (): Promise<void> => {
        try {
          setState({ ...defaultFriendState(), status: RequestStatus.Loading });
    
          await FriendService.delete(user.profile.uid, props.friend.uid);
    
          props.handleOnRemove();
        } catch (err) {
          console.error(err);
    
          setState({ ...defaultFriendState() ,status: RequestStatus.Error });
        }
      }
    
      return (
        <React.Fragment>    
          <Button className="passion-one-font" handleOnClick={remove}>
            Confirm
          </Button>
          <Button className="passion-one-font" handleOnClick={cancel}>
            Cancel
          </Button>
        </React.Fragment>
      )
    }

    const viewOptions = (): void => updateToggles({ viewOptions: true });

    return (
      <React.Fragment>
        <IconButton 
          icon="fal fa-ellipsis-v"
          tooltip="Options"
          tooltipSide={TooltipSide.Left}
          handleOnClick={viewOptions} 
        />
      </React.Fragment>
    )
  }

  return (
    <div className="friend">
      <Button className="friend-link" url={`/u/${props.friend.profile.friendID}`}>
        <UserLink profile={props.friend.profile} />
      </Button>
      <div className="friend-actions">
        {getActions()}
      </div>
    </div>
  );
}