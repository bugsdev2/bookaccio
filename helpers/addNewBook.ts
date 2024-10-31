import { getBookList } from './getBookList';
import { storeBooks } from './storeBooks';

export async function addNewBook(bookDetails: Book) {
    const bookList: Book[] = await getBookList();

    bookList.push(bookDetails);

    await storeBooks(bookList);
}
