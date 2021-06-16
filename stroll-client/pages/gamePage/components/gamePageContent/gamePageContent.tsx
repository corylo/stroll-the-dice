import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { GamePlayersPreview } from "../gamePlayersPreview/gamePlayersPreview";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";

import { GamePageContext } from "../../gamePage";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GamePageContentProps {
  
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { state, setState } = useContext(GamePageContext);

  const { game, invite, status, summary, toggles } = state;
  
  if(status === RequestStatus.Success && game !== null) {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    return (
      <div className="game-page-content">
        <GameDetails game={game} />
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1>
          <GameActions 
            creator={game.creator}
            invite={invite}
            toggle={() => toggle({ update: true })}
          />
          <GamePlayersPreview game={game} summary={summary} />
        </div>
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => toggle({ invite: false })} />
      </div>
    )
  }

  return null;
}