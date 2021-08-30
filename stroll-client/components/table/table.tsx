import React from "react";
import classNames from "classnames";

interface TableProps {
  id?: string;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

export const Table: React.FC<TableProps> = (props: TableProps) => {
  return(
    <div 
      id={props.id} 
      className={classNames("table-wrapper", props.className)}
    >       
      <div className="table">
        <table>
          {props.children}
        </table>
      </div>
    </div>
  )
}