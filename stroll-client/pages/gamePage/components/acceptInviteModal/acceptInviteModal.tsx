import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { UserLink } from "../../../../components/userLink/userLink";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { PlayerService } from "../../../../services/playerService";

import { PlayerUtility } from "../../../../utilities/playerUtility";

import { IPlayer } from "../../../../../stroll-models/player";

import { FormStatus } from "../../../../enums/formStatus";

interface AcceptInviteModalProps {  
  back: () => void;
}

export const AcceptInviteModal: React.FC<AcceptInviteModalProps> = (props: AcceptInviteModalProps) => {  
  const { appState } = useContext(AppContext),
    { state, setState } = useContext(GamePageContext);

  const [status, setStatus] = useState<FormStatus>(FormStatus.InProgress);

  const { user } = appState;

  if(state.invite === null && state.toggles.invite) {
    const acceptInvite = async (): Promise<void> => {
      try {
        setStatus(FormStatus.Submitting);

        const player: IPlayer = PlayerUtility.mapCreate(user.profile, state.game, state.invite);

        await PlayerService.create(state.game, player);
        
        setState({ ...state, toggles: { ...state.toggles, invite: false } });
      } catch (err) {
        console.error(err);

        setStatus(FormStatus.SubmitError);
      }
    }

    return (
      <Modal id="accept-invite-modal" priority>
        <ModalTitle text="You've been invited!" handleOnClose={props.back} />
        <ModalBody>
          <Form status={status}>
            <FormBody>
              <UserLink profile={state.game.creator} />
              <h1 className="game-name passion-one-font">{state.game.name}</h1>
              <GameDetails game={state.game} />
            </FormBody>
            <FormActions>    
              <Button
                className="submit-button fancy-button passion-one-font" 
                handleOnClick={acceptInvite}
              >
                Accept
              </Button>      
              <Button
                className="submit-button fancy-button white passion-one-font" 
                handleOnClick={props.back}
              >
                Decline
              </Button>
            </FormActions>
          </Form>
        </ModalBody>
      </Modal>
    );
  }

  return null;
}