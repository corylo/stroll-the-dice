import React from "react";

import { EventFilter } from "./eventFilter";

import { Icon } from "../../../../../../stroll-enums/icon";
import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";

interface EventFiltersProps {  
  
}

export const EventFilters: React.FC<EventFiltersProps> = (props: EventFiltersProps) => {  
  return (
    <div className="event-history-filters">
      <EventFilter
        eventCategory={GameEventCategory.Unknown}
        icon="fal fa-filter"
        text="All"
      />
      <EventFilter
        eventCategory={GameEventCategory.Game}
        icon={Icon.Dice}
        text="Game"
      />
      <EventFilter
        eventCategory={GameEventCategory.Steps}
        icon={Icon.Steps}
        text="Steps"
      />
    </div>
  );
}