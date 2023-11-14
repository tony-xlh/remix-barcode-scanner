import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import {CameraEnhancer} from "dynamsoft-camera-enhancer";
import { json } from "@remix-run/node";
import { getBooks } from "../data";
import styles from "~/styles/camera.css";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";
import { Link, useLoaderData,useNavigate } from "@remix-run/react";
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
  const navigate = useNavigate();
  const { books } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Remix Book Manager</h1>
      {books.map((bookRecord,idx)=>(
        <BookCard record={bookRecord} key={"book-card-"+idx}>
          <Link to={`/books/`+bookRecord.ISBN}>View</Link>
        </BookCard>
      ))}
      <div className="fab-container">
        <FloatingActionButton onClicked={()=>{
          console.log("clicked");
          navigate("/scanner");
        }}></FloatingActionButton>
      </div>
    </div>
  );
}
