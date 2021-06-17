import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { UserLink } from "../../../../components/userLink/userLink";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { GamePageContext } from "../../gamePage";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GamePageContentProps {
  
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { state, setState } = useContext(GamePageContext);

  const { game, invite, status, toggles } = state;
  
  if(status === RequestStatus.Success && game !== null) {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    return (
      <div className="game-page-content">
        <UserLink profile={game.creator} tooltip="Creator" />
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1>
          <GameDetails game={game} togglePlayers={() => toggle({ players: true })} />
          <GameActions 
            creator={game.creator}
            invite={invite}
            toggleInvite={() => toggle({ invite: true })}
            toggleUpdate={() => toggle({ update: true })}
          />
        </div>
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => toggle({ accept: false })} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
      </div>
    )
  }

  return null;
}