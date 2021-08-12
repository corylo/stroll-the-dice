import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { FormBodySection } from "../../../../components/form/formBodySection";
import { GameDayGiftingSection } from "../gameDayGiftingSection/gameDayGiftingSection";
import { GameDayRequirement } from "../../../../components/gameDayRequirement/gameDayRequirement";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { AcceptInviteService } from "./services/acceptInviteService";

import { PlayerUtility } from "../../../../utilities/playerUtility";

import { IPlayer } from "../../../../../stroll-models/player";

import { AppAction } from "../../../../enums/appAction";
import { FormStatus } from "../../../../enums/formStatus";
import { PlayerStatus } from "../../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface AcceptInviteModalProps {  
  back: () => void;
}

export const AcceptInviteModal: React.FC<AcceptInviteModalProps> = (props: AcceptInviteModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext),
    { state, setState } = useContext(GamePageContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [status, setStatus] = useState<FormStatus>(FormStatus.InProgress),
    [acceptedGiftDays, setAcceptedGiftDaysTo] = useState<boolean>(state.game.enableGiftDaysForJoiningPlayers);

  const { user } = appState;

  if(appState.toggles.acceptInvite) {
    const acceptInvite = async (): Promise<void> => {
      if(status !== FormStatus.Submitting) {
        try {
          setStatus(FormStatus.Submitting);

          setState({ ...state, statuses: { 
              ...state.statuses,               
              player: PlayerStatus.Loading,
              players: RequestStatus.Loading
            } 
          });

          const player: IPlayer = PlayerUtility.mapCreate(user.profile, state.game, state.invite, acceptedGiftDays);

          await AcceptInviteService.acceptInvite(state.game, player);
          
          setState({ ...state, player, statuses: { ...state.statuses, player: PlayerStatus.Playing } });

          dispatch(AppAction.ToggleAcceptInvite, false);
        } catch (err) {
          console.error(err);

          setStatus(FormStatus.SubmitError);
        }
      }
    }

    const getGameDayRequirementSection = (): JSX.Element => {
      if(!acceptedGiftDays) {
        return (
          <GameDayRequirement 
            available={user.stats.gameDays.available} 
            duration={state.game.duration} 
            type="join"
          />
        )
      }
    }

    return (
      <Modal id="accept-invite-modal">
        <ModalTitle text="You've been invited!" handleOnClose={props.back} />
        <ModalBody>
          <Form status={status} statusMessage="Whoops! Looks like you aren't able to join this game right now.">
            <FormBody>
              <FormBodySection className="accept-invite-details-section">
                <div className="accept-invite-details-header">
                  <PlayerStatement profile={state.game.creator} />
                  <GameDateStatus game={state.game} />
                </div>
                <div className="accept-invite-details-body">
                  <h1 className="game-name passion-one-font">{state.game.name}</h1>
                  <GameDetails game={state.game} />
                </div>
              </FormBodySection>
              <GameDayGiftingSection acceptingGift={acceptedGiftDays} setAcceptingGiftTo={setAcceptedGiftDaysTo} />
              {getGameDayRequirementSection()}
            </FormBody>
            <FormActions>    
              <Button
                className="submit-button fancy-button passion-one-font" 
                handleOnClick={acceptInvite}
              >
                Accept Invite
              </Button>      
              <Button
                className="submit-button fancy-button passion-one-font" 
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