import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

interface NavMenuButtonProps {  
  center?: boolean;
  icon: string;
  label: string;
  to: string;
}

export const NavMenuButton: React.FC<NavMenuButtonProps> = (props: NavMenuButtonProps) => {  
  const { center } = props;

  return (
    <div className={classNames("nav-menu-button-wrapper", { center })}>
      <NavLink to={props.to} className="nav-menu-button" exact>
        <i className={props.icon} />
        <h1 className="passion-one-font">{props.label}</h1>
      </NavLink>
    </div>
  )
}