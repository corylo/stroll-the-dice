import React from "react";

interface HourSelectorProps {  
  hour: number;
  select: (hour: number) => void;
}

export const HourSelector: React.FC<HourSelectorProps> = (props: HourSelectorProps) => {  
  const getAvailableHours = (): number[] => {
    let hours: number[] = [];

    for(let i: number = 0; i < 23; i++) {
      hours.push(i);
    }

    return hours;
  }
  
  const getOptions = (): JSX.Element[] => {
    const getText = (hour: number): string => {
      if(hour === 0) {
        return "12AM";
      } else if(hour < 12) {
        return `${hour}AM`;
      } else if (hour > 12) {
        return `${hour % 12}PM`;
      }

      return "12PM";
    }

    return getAvailableHours().map((hour: number) => (                 
      <option key={hour} value={hour}>{getText(hour)}</option>
    ));
  }

  return (
    <select 
      className="hour-selector passion-one-font" 
      value={props.hour} 
      onChange={(e: any) => props.select(e.target.value)}
    >
      {getOptions()}
    </select>
  );
}