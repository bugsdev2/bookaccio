declare module '.png';

declare interface BookItem {
    author: string;
    currentPage: number;
    endDate: number;
    googleBooksLink: string;
    id: number;
    isbn: string;
    labels: any;
    language: string;
    pageCount: number;
    position: number;
    publishedDate: string;
    rating: number;
    startDate: number;
    state: string;
    subTitle: string;
    summary?: string;
    thumbnailAddress?: string;
    title: string;
    wishlistDate: number;
}
