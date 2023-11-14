import { Form, useLoaderData,useNavigate } from "@remix-run/react";
import { BookRecord, editBook, getBook } from "../data";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  if (params.bookId) {
    const bookRecord = await getBook(params.bookId);
    if (!bookRecord) {
      throw new Response("Not Found", { status: 404 });
    }
    return json({ bookRecord });
  }else{
    throw new Response("Not Found", { status: 404 });
  }
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  if (params.bookId) {
    let bookRecord:BookRecord|null = await getBook(params.bookId);
    if (bookRecord) {
      bookRecord.title = updates.title.toString();
      bookRecord.author = updates.author.toString();
      editBook(params.bookId,bookRecord)
    } 
  }
  return redirect(`/books/${params.bookId}`);
};

export default function EditBook() {
  const navigate = useNavigate();
  const { bookRecord } = useLoaderData<typeof loader>();
  return (
    <Form id="book-form" method="post">
      <p className="book-info-item">
        <label>
          Title:
        </label>
        <input name="title" type="text" defaultValue={bookRecord.title}/>
        <label>
          Author:
        </label>
        <input name="author" type="text" defaultValue={bookRecord.author}/>
      </p>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={()=>{
          navigate(-1);
        }}>Cancel</button>
      </p>
    </Form>
  );
}
