import { type MetaFunction, type LinksFunction, redirect, ActionFunctionArgs, json } from "@remix-run/node";
import { useEffect, useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import {CameraEnhancer} from "dynamsoft-camera-enhancer";
import styles from "~/styles/camera.css";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";
import { Form, useLoaderData, useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import { addBook } from "~/data";
import { queryBook } from "~/bookAPI";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Barcode Scanner" },
    { name: "description", content: "Remix Barcode Scanner." },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export async function loader() {
  return json({
    ENV: {
      DBR_LICENSE: process.env.DBR_LICENSE,
    },
  });
}

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const title = updates.title.toString();
  const author = updates.author.toString();
  const ISBN = updates.ISBN.toString();
  const timeStamp = new Date().getTime().toString();
  await addBook({
    title:title,
    author:author,
    ISBN:ISBN,
    createdAt:timeStamp
  })  
  return redirect(`/`);
};

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  useEffect(()=>{
    const goBack = () => {
      navigate("/");
    }
    setTimeout(goBack,3000);
  },[])
  return (
    <div>Failed to create a new record. Maybe the book has been scanned.</div>
  );
}


export default function Scanner() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { state } = useNavigation();
  const [isActive,setIsActive] = useState(false);
  const [initialized,setInitialized] = useState(false);
  const [ISBN,setISBN] = useState("");
  const [author,setAuthor] = useState("");
  const [title,setTitle] = useState("");
  const busy = state === "submitting";
  const startBarcodeScanner = () => {
    if (initialized) {
      reset();
      setIsActive(true);
    }else{
      alert("Please wait for the initialization and then try again.");
    }
  }
  const stopBarcodeScanner = () => {
    setIsActive(false);
  }

  const reset = () => {
    setISBN("");
    setAuthor("");
    setTitle("");
  }

  return (
    <div>
      <h1>New Book</h1>
      <Form id="book-form" method="post" 
        onSubmit={(event) => {
          if (!ISBN) {
            alert("ISBN must not be empty");
            event.preventDefault();
          }
        }}>
        <div>
          <label>
            ISBN:
            <input name="ISBN" onChange={e=>setISBN(e.target.value)} type="text" value={ISBN}/>
          </label>
          <button type="button" onClick={()=>startBarcodeScanner()} >Scan</button>
        </div>
        <div>
          <label>
            Title:
            <input name="title" onChange={e=>setTitle(e.target.value)} type="text" value={title}/>
          </label>
        </div>
        <div>
          <label>
            Author:
            <input name="author" onChange={e=>setAuthor(e.target.value)} type="text" value={author}/>
          </label>
        </div>
        <button type="submit" disabled={busy}>{busy ? "Submiting..." : "Submit"}</button>
        <button type="button" onClick={()=>navigate(-1)}>Back</button>
      </Form>
      <div className="scanner" style={{display:isActive?"":"none"}}>
        <BarcodeScanner 
          license={data.ENV.DBR_LICENSE ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="}
          onInitialized={async (_enhancer:CameraEnhancer,reader:BarcodeReader)=>{
            const settings = await reader.getRuntimeSettings();
            settings.expectedBarcodesCount = 0;
            await reader.updateRuntimeSettings(settings);
            setInitialized(true);
          }} 
          onScanned={async (results)=> {
            console.log(results);
            if (results.length>0) {
              setIsActive(false);
              console.log("set ISBN");
              setISBN(results[0].barcodeText);
              try {
                let bookInfo = await queryBook(results[0].barcodeText);
                setTitle(bookInfo.title);
                setAuthor(bookInfo.author);
              } catch (error) {
                alert("Faild to fill in title and author automatically.");
              }
            }
          }}
          scanRegion={{
            top:20,
            left:0,
            right:100,
            bottom: 60
          }}
          isActive={isActive}
        >
          <button style={{position:"absolute",right:0}} onClick={()=>stopBarcodeScanner()} >Close</button>
        </BarcodeScanner>
      </div>
    </div>
  );
}
