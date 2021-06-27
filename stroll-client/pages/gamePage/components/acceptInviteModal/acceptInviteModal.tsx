import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { UserLink } from "../../../../components/userLink/userLink";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { PlayerService } from "../../../../services/playerService";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
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

  if(state.toggles.accept) {
    const acceptInvite = async (): Promise<void> => {
      try {
        setStatus(FormStatus.Submitting);

        const player: IPlayer = PlayerUtility.mapCreate(user.profile, state.game, state.invite);
          
        await PlayerService.create(state.game, player);;
        
        setState({ 
          ...state, 
          game: {
            ...state.game,
            counts: {
              ...state.game.counts,
              players: state.game.counts.players + 1
            }
          },
          player: {
            ...state.player,
            id: user.profile.uid
          },
          toggles: { ...state.toggles, accept: false }
        });
      } catch (err) {
        console.error(err);

        setStatus(FormStatus.SubmitError);
      }
    }

    return (
      <Modal id="accept-invite-modal">
        <ModalTitle text="You've been invited!" handleOnClose={props.back} />
        <ModalBody>
          <Form status={status} statusMessage="Whoops! Looks like this game is locked.">
            <FormBody>
              <UserLink profile={state.game.creator} />
              <GameDateStatus game={state.game} gameStatus={GameDurationUtility.getGameStatus(state.game)} />
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