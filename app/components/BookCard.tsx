import { BookRecord } from "~/data";
import { ReactElement, ReactNode } from "react";

const BookCard = (props:{record:BookRecord,children?:ReactNode}): ReactElement => {
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
      {props.children}
    </div>
  )
}

export default BookCard;
