import React from "react";

import { PlayerStatement } from "../playerStatement/playerStatement";

import { IProfileReference } from "../../../stroll-models/profileReference";

interface MatchupStatementProps {  
  left: IProfileReference;
  right: IProfileReference;
}

export const MatchupStatement: React.FC<MatchupStatementProps> = (props: MatchupStatementProps) => {  
  const { left, right } = props;

  return (
    <span className="matchup-statement"><PlayerStatement profile={left} /><span className="matchup-vs-statement">VS</span><PlayerStatement profile={right} /></span>    
  );
}