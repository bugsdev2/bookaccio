import { getBookList } from './getBookList';
import { storeBooks } from './storeBooks';

type BookProps = {
    author?: string;
    currentPage?: number;
    endDate?: number;
    googleBooksLink?: string;
    id: number;
    isbn?: string;
    labels?: any;
    language?: string;
    pageCount?: number;
    position?: number;
    publishedDate?: string;
    rating?: number;
    startDate?: number;
    state?: string;
    subTitle?: string;
    summary?: string;
    thumbnailAddress?: string;
    title?: string;
    wishlistDate?: number;
};

export const updateBookDetails = async ({ currentPage, author, endDate, googleBooksLink, id, pageCount, publishedDate, state, startDate, summary, title, subTitle, wishlistDate, rating }: BookProps) => {
    const bookList: BookItem[] = await getBookList();

    const updatedBooklist = bookList.map((book) => {
        if (book.id === id) {
            return {
                currentPage: currentPage ? currentPage : book.currentPage,
                author: author ? author : book.author,
                endDate: endDate ? endDate : book.endDate,
                googleBooksLink: googleBooksLink ? googleBooksLink : book.googleBooksLink,
                pageCount: pageCount ? pageCount : book.pageCount,
                publishedDate: publishedDate ? publishedDate : book.publishedDate,
                state: state ? state : book.state,
                startDate: startDate ? startDate : book.startDate,
                summary: summary ? summary : book.summary,
                title: title ? title : book.title,
                subTitle: subTitle ? subTitle : book.subTitle,
                wishlistDate: wishlistDate ? wishlistDate : book.wishlistDate,
                rating: rating ? rating : book.rating,
                id: book.id,
                thumbnailAddress: book.thumbnailAddress,
                isbn: book.isbn,
                language: book.language,
                labels: book.labels,
                position: book.position,
            };
        } else {
            return book;
        }
    });

    storeBooks(updatedBooklist);
};
