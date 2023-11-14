import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteBook } from "../data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.bookId, "Missing contactId param");
  await deleteBook(params.bookId);
  return redirect("/");
};