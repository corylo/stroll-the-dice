import React, { useContext, useState } from "react";
import classNames from "classnames";

import { AppContext } from "../../../app/contexts/appContext";

import { HowToPlayID } from "../../../../enums/howToPlayID";

interface HowToPlayModalSectionProps {  
  children?: any;
  className?: string;
  id?: HowToPlayID;
  subsection?: boolean;
  title: string;
}

export const HowToPlayModalSection: React.FC<HowToPlayModalSectionProps> = (props: HowToPlayModalSectionProps) => {  
  const { appState } = useContext(AppContext);

  const { toggles } = appState;

  const [toggled, setToggledTo] = useState<boolean>(toggles.howToPlayID === props.id);

  const toggle = (): void => setToggledTo(!toggled);

  const getTitle = (): JSX.Element => {
    if(props.subsection) {
      return (
        <div className="how-to-play-modal-section-title">
          <h1 className="passion-one-font">{props.title}</h1>
        </div>
      )
    }

    return (      
      <button className="how-to-play-modal-section-title clickable" onClick={toggle}>
        <h1 className="passion-one-font">{props.title}</h1>
        <i className={classNames({ "fal fa-plus": !toggled, "fal fa-minus": toggled })} />
      </button>
    )
  }

  const getContent = (): JSX.Element => {
    if(props.children && (toggled || props.subsection)) {
      return (        
        <div className="how-to-play-modal-section-content">
          {props.children}
        </div>
      )
    }
  }

  return (
    <div id={props.id} className={classNames("how-to-play-modal-section", props.className, { subsection: props.subsection })}>
      {getTitle()}
      {getContent()}
    </div>
  );
}