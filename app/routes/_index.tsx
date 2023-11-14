import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import {CameraEnhancer} from "dynamsoft-camera-enhancer";
import { json } from "@remix-run/node";
import { getBooks } from "../data";
import styles from "~/styles/camera.css";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";
import { Link, useLoaderData } from "@remix-run/react";
import BookCard from "~/components/BookCard";
import FloatingActionButton from "~/components/FloatActionButton";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const loader = async () => {
  const books = await getBooks();
  return json({ books });
};


export default function Index() {
  const { books } = useLoaderData<typeof loader>();
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
      {books.map((bookRecord,idx)=>(
        <BookCard record={bookRecord} key={"book-card-"+idx}>
          <Link to={`/books/`+bookRecord.ISBN}>View</Link>
        </BookCard>
      ))}
      <div className="fab-container">
        <FloatingActionButton onClicked={()=>{
          console.log("clicked");
        }}></FloatingActionButton>
      </div>
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
