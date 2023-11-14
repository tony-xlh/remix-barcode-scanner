import { Form, useLoaderData,useNavigate } from "@remix-run/react";
import { getBook } from "../data";
import BookCard from "~/components/BookCard";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.bookId, "Missing bookId param");
  const bookRecord = await getBook(params.bookId);
  if (!bookRecord) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ bookRecord });
};

export default function Book() {
  const navigate = useNavigate();
  const { bookRecord } = useLoaderData<typeof loader>();
  return (
    <div>
      <BookCard record={bookRecord} editable={false}>
        <div style={{display:"flex"}}>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </BookCard>
      <button onClick={()=>navigate(-1)}>Back</button>
    </div>
  );
}
