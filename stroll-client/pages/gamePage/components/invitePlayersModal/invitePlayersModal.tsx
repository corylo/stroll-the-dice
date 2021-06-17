import React, { useContext } from "react";

import { CopyButton } from "../../../../components/copyButton/copyButton";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

import { GamePageContext } from "../../gamePage";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";

import { InviteUtility } from "../../../../utilities/inviteUtility";

interface InvitePlayersModalProps {  
  back: () => void;
}

export const InvitePlayersModal: React.FC<InvitePlayersModalProps> = (props: InvitePlayersModalProps) => {  
  const { state } = useContext(GamePageContext);

  useOnClickAwayEffect(
    state.toggles.invite, 
    ["invite-players-modal-content"], 
    [state.toggles.invite, state.status], 
    props.back
  );

  if(state.toggles.invite) {
    return (
      <Modal id="invite-players-modal" priority>
        <ModalTitle text="Invite players!" handleOnClose={props.back} />
        <ModalBody>          
          <h1 className="instructions passion-one-font">Copy the link below and send it to anyone you'd like to invite!</h1>
          <CopyButton
            key="copy"
            icon="fal fa-link"
            tooltip="Invite"
            tooltipSide={TooltipSide.Bottom}
            value={InviteUtility.getLink(state.invite)}
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}