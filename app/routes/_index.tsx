import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import {CameraEnhancer} from "dynamsoft-camera-enhancer";
import type { LinksFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import styles from "~/styles/camera.css";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function Index() {
  const [isActive,setIsActive] = useState(false);
  const [initialized,setInitialized] = useState(false);
  const [barcodes,setBarcodes] = useState<TextResult[]>([]);
  const startBarcodeScanner = () => {
    if (initialized) {
      setIsActive(true);
    }else{
      alert("Please wait for the initialization and then try again.");
    }
  }
  const stopBarcodeScanner = () => {
    setIsActive(false);
  }
  return (
    <div>
      <h1>Remix Barcode Scanner</h1>
      <button onClick={()=>startBarcodeScanner()} >Start Scanning</button>
      <ol>
        {barcodes.map((barcode,idx)=>(
          <li key={idx}>{barcode.barcodeFormatString+": "+barcode.barcodeText}</li>
        ))}
      </ol>
      <div className="scanner" style={{display:isActive?"":"none"}}>
        <BarcodeScanner 
          onInitialized={async (_enhancer:CameraEnhancer,reader:BarcodeReader)=>{
            const settings = await reader.getRuntimeSettings();
            settings.expectedBarcodesCount = 0;
            await reader.updateRuntimeSettings(settings);
            setInitialized(true);
          }} 
          onScanned={(results)=> {
            console.log(results);
            setIsActive(false);
            setBarcodes(results);
          }}
          isActive={isActive}
        >
          <button style={{position:"absolute",right:0}} onClick={()=>stopBarcodeScanner()} >Close</button>
        </BarcodeScanner>
      </div>
    </div>
  );
}
