import { Alert } from 'react-native';
import { getBookList } from './getBookList';
import { storeBooks } from './storeBooks';

export const updateBookDetails = async ({ currentPage, authors, endDate, imageLinks, id, pageCount, publishedDate, state, startDate, description, title, subtitle, rating }: Book) => {
    const bookList: Book[] = await getBookList();

    const updatedBooklist = bookList.map((book) => {
        if (book.id === id) {
            return {
                currentPage: currentPage ? currentPage : book.currentPage,
                authors: authors ? authors : book.authors[0],
                endDate: endDate ? endDate : book.endDate,
                image: book?.imageLinks ? book?.imageLinks?.thumbnail : undefined,
                pageCount: pageCount ? pageCount : book.pageCount,
                publishedDate: publishedDate ? publishedDate : book.publishedDate,
                state: state ? state : book.state,
                startDate: startDate ? startDate : book.startDate,
                description: description ? description : book.description,
                title: title ? title : book.title,
                subtitle: subtitle ? subtitle : book.subtitle,
                rating: rating ? rating : book.rating,
                id: book.id,
                isbn: book.isbn,
                language: book.language,
            };
        } else {
            return book;
        }
    });

    console.log('hello');

    storeBooks(updatedBooklist);
};
