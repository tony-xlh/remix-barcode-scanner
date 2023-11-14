import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import type { LinksFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import styles from "~/styles/camera.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function Index() {
  const [isActive,setIsActive] = useState(false);
  return (
    <div>
      <h1>Remix Barcode Scanner</h1>
      <button onClick={()=>setIsActive(true)} >Start Scanning</button>
      <div className="scanner" style={{display:isActive?"":"none"}}>
        <BarcodeScanner isActive={isActive}></BarcodeScanner>
      </div>
    </div>
  );
}
