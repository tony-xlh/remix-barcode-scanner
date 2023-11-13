import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [isActive,setIsActive] = useState(false);
  return (
    <div>
      <h1>Remix Barcode Scanner</h1>
      <button onClick={()=>setIsActive(true)} >Start Scanning</button>
      <div className="scanner" style={{display:isActive?"":"none",position:"absolute",width:"100%",height:"100%",top:0,left:0}}>
        <BarcodeScanner isActive={isActive}></BarcodeScanner>
      </div>
    </div>
  );
}
