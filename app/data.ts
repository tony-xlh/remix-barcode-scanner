import { PrismaClient } from "@prisma/client";

export type BookRecord = {
  ISBN:string;
  title:string;
  author:string;
  createdAt: string;
};

const books = {
  convertRecord(book:{
    ISBN: string;
    title: string;
    author: string;
    createdAt: Date;
  }|null):BookRecord|null{
    if (book) {
      return {
        ISBN:book.ISBN,
        title:book.title,
        author:book.author,
        createdAt:book.createdAt.getTime().toString()
      }
    }else{
      return null;
    }
  },

  async getAll(): Promise<BookRecord[]> {
    const prisma = new PrismaClient();
    const allBooks = await prisma.book.findMany();
    const bookRecords = [];
    for (let index = 0; index < allBooks.length; index++) {
      const converted = this.convertRecord(allBooks[index]);
      if (converted) {
        bookRecords.push(converted);
      }
    }
    await prisma.$disconnect();
    return bookRecords;
  },

  async get(id: string): Promise<BookRecord | null> {
    const prisma = new PrismaClient();
    const book = await prisma.book.findUnique({
      where: {
        ISBN: id,
      },
    })
    await prisma.$disconnect();
    return this.convertRecord(book);
  },

  async create(record: BookRecord): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.book.create({
      data: {
        title: record.title,
        author: record.author,
        ISBN: record.ISBN
      },
    })
    await prisma.$disconnect();
  },

  async set(id: string, record: BookRecord): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.book.update({
      where: {
        ISBN: id,
      },
      data: {
        author: record.author,
        title: record.title,
      },
    })
    await prisma.$disconnect();
  },

  async destroy(id: string): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.book.delete({
      where: {
        ISBN: id,
      },
    })
    await prisma.$disconnect();
  },
};

export async function addBook(record:BookRecord){
  await books.create(record);
} 

export async function getBooks(): Promise<BookRecord[]>{
  return await books.getAll();
} 

export async function getBook(id:string): Promise<BookRecord|null>{
  return await books.get(id);
} 

export async function editBook(id:string,record:BookRecord): Promise<void>{
  await books.set(id,record);
} 

export async function deleteBook(id:string): Promise<void>{
  await books.destroy(id);
} 
