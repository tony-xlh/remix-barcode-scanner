import { BookRecord } from "~/data";
import React from "react";



const BookCard = (props:{record:BookRecord,editable?:Boolean}): React.ReactElement => {
  return (
    <div className="book-card">
      {Object.keys(props.record).map((key)=>(
        <div className="book-info-item">
          <label>
            {key.toUpperCase()}:&nbsp;
          </label>
          <input type="text" value={(props.record as any)[key]}/>
        </div>
      ))}
    </div>
  )
}

export default BookCard;
