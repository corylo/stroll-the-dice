import React from "react";

import { ExampleMatchupStat } from "./exampleMatchupStat";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { Icon } from "../../../stroll-enums/icon";

interface ExampleMatchupStatsProps {  
  
}

export const ExampleMatchupStats: React.FC<ExampleMatchupStatsProps> = (props: ExampleMatchupStatsProps) => {      
  const ratio: number = NumberUtility.randomDecimal(1, 5),
    spread: number = NumberUtility.random(1000, 5000);

  return (    
    <div className="example-matchup-stats">
      <ExampleMatchupStat 
        description="The total number of steps the player has taken today."
        icon={Icon.Steps} 
        index={1}
        interval={5000}
        title="Steps"
        value={NumberUtility.random(1000, 10000)} 
        formatValue={(value: number) => value.toLocaleString()}
      />
      <ExampleMatchupStat 
        description="The expected difference in total steps based on average daily steps for each player."
        icon={Icon.Spread} 
        index={2}
        interval={5000}
        title="Spread"
        value={spread} 
        formatValue={(value: number) => `+ ${value.toLocaleString()}`}
      />
      <ExampleMatchupStat 
        description="The total amount of points wagered on this player."
        icon={Icon.Points} 
        index={3}
        interval={5000}
        title="Total Wagered"
        value={NumberUtility.random(10000, 40000)} 
        formatValue={(value: number) => NumberUtility.shorten(value)}
      />
      <ExampleMatchupStat 
        description="Determines the number of points returned. Based on the total wagered on each side."
        icon={Icon.Dice} 
        index={4}
        interval={5000}
        title="Return Ratio"
        value={ratio}
        formatValue={(value: number) => `1 : ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`}
      />
      <ExampleMatchupStat 
        description="The total number of players who have wagered on this side of the matchup."
        icon={Icon.Players} 
        index={5}
        interval={5000}
        title="Participants"
        value={NumberUtility.random(10, 20)} 
      />
    </div>
  )
}