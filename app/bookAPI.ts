export interface BookInfo{
  title:string;
  author:string;
}

export async function queryBook(ISBN:string):Promise<BookInfo> {
  try {
    let response = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:"+ISBN);
    let json = await response.json();
    let bookItem = json["items"][0];
    let title = bookItem["volumeInfo"]["title"];
    let author = bookItem["volumeInfo"]["authors"].join(", ");
    return {
      title:title,
      author:author
    }
  } catch (error) {
    throw error;
  }
}