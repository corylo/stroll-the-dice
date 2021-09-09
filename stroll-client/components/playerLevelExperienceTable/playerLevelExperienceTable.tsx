import React from "react";

import { Table } from "../table/table";

import { PlayerLevelUtility } from "../../utilities/playerLevelUtility";

import { PlayerLevelConstraint } from "../../../stroll-enums/playerLevelConstraint";

interface PlayerLevelExperienceTableProps {  
  
}

export const PlayerLevelExperienceTable: React.FC<PlayerLevelExperienceTableProps> = (props: PlayerLevelExperienceTableProps) => {  
  const getRows = (): JSX.Element[] => {
    let rows: JSX.Element[] = [];

    for(let i: number = PlayerLevelConstraint.MinimumLevel; i <= PlayerLevelConstraint.MaximumLevel; i++) {
      rows.push(
        <tr key={i}>
          <td className="passion-one-font">{i}</td>
          <td className="passion-one-font">{PlayerLevelUtility.getMinimumExperienceByLevel(i).toLocaleString()}</td>
          <td><i className={PlayerLevelUtility.getBadge(i)} /></td>
        </tr>
      )
    }

    return rows;
  }

  return (    
    <Table className="player-level-experience-table">
      <thead>
        <tr className="passion-one-font">
          <th>Level</th>
          <th>Minimum XP</th>        
          <th>Badge</th>  
        </tr>
      </thead>
      <tbody>
        {getRows()}
      </tbody>
    </Table>
  );
}