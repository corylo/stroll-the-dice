import React from "react";

import { EventFilter } from "./eventFilter";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";
import { Icon } from "../../../../../../stroll-enums/icon";

interface EventFiltersProps {  
  
}

export const EventFilters: React.FC<EventFiltersProps> = (props: EventFiltersProps) => {  
  return (
    <div className="event-history-filters">
      <EventFilter
        category={GameEventCategory.Unknown}
        icon="fal fa-filter"
        text="All"
      />
      <EventFilter
        category={GameEventCategory.Game}
        icon={Icon.Dice}
        text="Game"
      />
      <EventFilter
        category={GameEventCategory.Steps}
        icon={Icon.Steps}
        text="Steps"
      />
      <EventFilter
        category={GameEventCategory.Prediction}
        icon={Icon.Dice}
        text="Predictions"
      />
    </div>
  );
}