import { BookRecord } from "~/data";
import { ReactElement, ReactNode, useState } from "react";

export interface BookCardProps {
  record:BookRecord,
  children?:ReactNode
}

const BookCard = (props:BookCardProps): ReactElement => {
  const renderValue = (key:string) => {
    const value = (props.record as any)[key];
    if (key === "createdAt") {
      return new Date(parseInt(value)).toUTCString();
    }else{
      return value;
    }
  }
  return (
    <div className="book-card">
      {Object.keys(props.record).map((key)=>(
        <div className="book-info-item" key={key}>
          <label>
            {key.toUpperCase()}:&nbsp;
          </label>
          <input type="text" defaultValue={renderValue(key)}/>
        </div>
      ))}
      {props.children}
    </div>
  )
}

export default BookCard;
