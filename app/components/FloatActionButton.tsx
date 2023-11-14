import React from "react";

export interface FloatingActionButtonProps {
  onClicked?: () => void;
  imgSrc?:string;
}

const FloatingActionButton = (props:FloatingActionButtonProps): React.ReactElement => {
  return (
    <div className="fab">
      <a href="javascript:void(0)"
        onClick={()=>{
          if (props.onClicked) {
            props.onClicked();
          }
        }}
      >
        <img alt="" src={props.imgSrc ?? "https://unpkg.com/ionicons@7.1.0/dist/svg/add-outline.svg"}/>
      </a>
    </div>
  )
}

export default FloatingActionButton;
