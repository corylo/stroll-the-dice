import React, { useContext } from "react";
import { useHistory } from "react-router";

import { GameForm } from "../../components/gameForm/gameForm";
import { Page } from "../../components/page/page";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { CreateGameService } from "./services/createGameService";

import { GameFormUtility } from "../../components/gameForm/utilities/gameFormUtility";
import { ImageUtility } from "../../utilities/imageUtility";
import { InviteUtility } from "../../utilities/inviteUtility";
import { PlayerUtility } from "../../utilities/playerUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameFormStateFields } from "../../components/gameForm/models/gameFormStateFields";
import { IInvite } from "../../../stroll-models/invite";
import { IPlayer } from "../../../stroll-models/player";

import { AppStatus } from "../../enums/appStatus";

interface CreateGamePageProps {
  
}

export const CreateGamePage: React.FC<CreateGamePageProps> = (props: CreateGamePageProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const history: any = useHistory();

  const save = async (fields: IGameFormStateFields): Promise<void> => {    
    const game: IGame = GameFormUtility.mapCreate(fields, user),
      invite: IInvite = InviteUtility.mapCreate(),
      player: IPlayer = PlayerUtility.mapCreate(user.profile, game, invite, false);
    
    await CreateGameService.createGame(game, player, invite);

    history.push(`/game/${game.id}`);
  }

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <GameForm title="Create Game" forwarding save={save} />
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("matchup", "png")}
          index={2}
          text="Sign in to create a game!"
        />
      )
    }
  }

  return(
    <Page id="create-game-page" backgroundGraphic="">    
      {getContent()}
    </Page>
  )
}