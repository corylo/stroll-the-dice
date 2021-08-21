import React from "react";

import { GameStatusFilter } from "./gameStatusFilter";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { GameGroupByFilter } from "./gameGroupByFilter";
import { GroupGameBy } from "../../../../../stroll-enums/groupGameBy";

interface GameFiltersProps {  
  
}

export const GameFilters: React.FC<GameFiltersProps> = (props: GameFiltersProps) => {  
  return (
    <div className="game-filters">
      <div className="game-filters-section">
        <div className="game-filters-section-items">
          <GameGroupByFilter
            groupBy={GroupGameBy.Hosting}
          />
          <GameGroupByFilter
            groupBy={GroupGameBy.Joined}
          />
        </div>
      </div>
      <div className="game-filters-section">
        <div className="game-filters-section-items">
          <GameStatusFilter
            status={GameStatus.Upcoming}
          />
          <GameStatusFilter
            status={GameStatus.InProgress}
          />
          <GameStatusFilter
            status={GameStatus.Completed}
          />
          </div>
      </div>
    </div>
  );
}