import { BookRecord } from "~/data";
import { ReactElement, ReactNode, useState } from "react";

export interface BookCardProps {
  record:BookRecord,
  editable?:boolean,
  children?:ReactNode
  onChange?: (record:BookRecord) => void;
}

const BookCard = (props:BookCardProps): ReactElement => {
  const [bookRecord,setBookRecord] = useState<BookRecord>(props.record); 
  const updateValue = (key:string,value:string) => {
    if (props.editable === true) {
      let newRecord = JSON.parse(JSON.stringify(bookRecord));//deep copy
      newRecord[key] = value;
      setBookRecord(newRecord);
      if (props.onChange) {
        props.onChange(newRecord);
      }
    }
  }
  
  return (
    <div className="book-card">
      {Object.keys(bookRecord).map((key)=>(
        <div className="book-info-item" key={key}>
          <label>
            {key.toUpperCase()}:&nbsp;
          </label>
          <input type="text" onChange={e=>{
           console.log(e.target.value);
           updateValue(key,e.target.value);
          }} value={(bookRecord as any)[key]}/>
        </div>
      ))}
      {props.children}
    </div>
  )
}

export default BookCard;
