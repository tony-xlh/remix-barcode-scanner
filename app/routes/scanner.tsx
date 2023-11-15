import { type MetaFunction, type LinksFunction, redirect, ActionFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import {CameraEnhancer} from "dynamsoft-camera-enhancer";
import styles from "~/styles/camera.css";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";
import { Form, useNavigate } from "@remix-run/react";
import { addBook } from "~/data";
import { queryBook } from "~/bookAPI";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];


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
    addBook({
      title:title,
      author:author,
      ISBN:ISBN,
      createdAt:timeStamp
    })
    return redirect(`/`);
  };


export default function Scanner() {
  const navigate = useNavigate();
  const [isActive,setIsActive] = useState(false);
  const [initialized,setInitialized] = useState(false);
  const [ISBN,setISBN] = useState("");
  const [author,setAuthor] = useState("");
  const [title,setTitle] = useState("");
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
        <button type="submit">Submit</button>
        <button type="button" onClick={()=>navigate(-1)}>Back</button>
      </Form>
      <div className="scanner" style={{display:isActive?"":"none"}}>
        <BarcodeScanner 
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
