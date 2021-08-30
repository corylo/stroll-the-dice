import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "../../../../components/buttons/button";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { Table } from "../../../../components/table/table";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GameStatsSectionContext } from "../gameStatsSection/gameStatsSection";

import { useFetchGameHistoryEffect } from "../../effects/gameHistoryEffects";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { IGameHistoryEntry } from "../../../../../stroll-models/gameHistoryEntry";
import { defaultViewGameHistoryState, IViewGameHistoryState } from "../../models/viewGameHistoryState";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewGameHistoryModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { appState } = useContext(AppContext),
    { toggles } = useContext(GameStatsSectionContext).state;

  const [state, setState] = useState<IViewGameHistoryState>(defaultViewGameHistoryState());

  const history: any = useHistory();

  useFetchGameHistoryEffect(state, toggles.history, appState.user.profile.uid, setState);

  if(toggles.history) {
    const getHistoryTable = (): JSX.Element => {
      if(state.statuses.initial !== RequestStatus.Loading && state.entries.length > 0) {
        const entries: JSX.Element[] = state.entries.map((entry: IGameHistoryEntry) => (
          <tr key={entry.id} className="passion-one-font" onClick={() => history.push(`/game/${entry.gameID}`)}>
            <td className="game-name">{entry.name}</td>
            <td>{entry.duration}</td>
            <td>{NumberUtility.shorten(entry.steps)}</td>
            <td>{NumberUtility.shorten(entry.points)}</td>
            <td>{entry.place}</td>
            <td className="game-ends-at">{FirestoreDateUtility.timestampToLocaleDateTime(entry.endsAt)}</td>
          </tr>
        ));

        return (
          <Table className="view-game-history-table">
            <thead>
              <tr className="passion-one-font">
                <th>Game</th>
                <th>Duration</th>
                <th>Steps</th>
                <th>Points</th>
                <th>Place</th>
                <th>Ended At</th>
              </tr>
            </thead>
            <tbody>
              {entries}
            </tbody>
          </Table>
        )
      }
    }

    const getViewMoreButton = (): JSX.Element => {
      if(
        state.statuses.more !== RequestStatus.Loading && 
        state.entries.length !== 0 &&
        !state.end
      ) {
        return (        
          <Button 
            className="view-more-button passion-one-font" 
            handleOnClick={() => setState({ ...state, index: state.index + 1 })}
          >
            View more
          </Button>
        )
      }
    }
  
    const getLoadingIcon = (): JSX.Element => {
      if(state.statuses.more === RequestStatus.Loading) {
        return (
          <div className="view-more-loading-icon">
            <LoadingIcon />
          </div>
        )
      }
    }
  
    const getEmptyMessage = (): JSX.Element => {
      if(state.statuses.more !== RequestStatus.Loading && state.entries.length === 0) {
        return (
          <EmptyMessage text="No history available yet" />
        )
      }
    }
  
    return (
      <Modal id="view-game-history-modal" status={state.statuses.initial}>
        <ModalTitle text="Game History" handleOnClose={props.back} />
        <ModalBody>       
          {getHistoryTable()}
          {getViewMoreButton()}
          {getLoadingIcon()}
          {getEmptyMessage()}
        </ModalBody>
      </Modal>
    );
  }

  return null;
}