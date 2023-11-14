import sortBy from "sort-by";
export type BookRecord = {
  ISBN:number;
  title:string;
  author:string;
  createdAt: string;
};

const books = {
  records: {} as Record<string, BookRecord>,

  async getAll(): Promise<BookRecord[]> {
    return Object.keys(books.records)
      .map((key) => books.records[key])
      .sort(sortBy("createdAt"));
  },

  async get(id: string): Promise<BookRecord | null> {
    return books.records[id] || null;
  },

  async create(record: BookRecord): Promise<void> {
    books.records[record.ISBN] = record;
  },

  async set(id: string, record: BookRecord): Promise<void> {
    books.records[id] = record;
  },

  destroy(id: string): null {
    delete books.records[id];
    return null;
  },
};

export async function addBook(record:BookRecord){
  await books.create(record);
} 

export async function getBooks(): Promise<BookRecord[]>{
  return await books.getAll();
} 