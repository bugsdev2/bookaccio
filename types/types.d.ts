declare module '*.png';

declare interface SettingItemProps {
    label: string;
    data: { title: string; value: string | boolean }[];
}

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
    summary: string;
    thumbnailAddress: string;
    title: string;
    wishlistDate: number;
}

declare interface BookSearchResultProp {
    id: string;
    selfLink: string;
    volumeInfo: {
        authors: [author: string];
        canonicalVolumeLink: 'https://play.google.com/store/books/details?id=CmPPDwAAQBAJ';
        categories: [];
        description: string;
        imageLinks: { thumbnail: string };
        language: string;
        publishedDate: string;
        publisher: string;
        title: string;
        subtitle: string;
    };
}

declare interface Book {
    authors?: string[];
    categories?: string[];
    description?: string;
    imageLinks?: {
        extraLarge?: string;
        large?: string;
        medium?: string;
        small?: string;
        smallThumbnail?: string;
        thumbnail?: string;
    };
    language?: 'en';
    maturityRating?: 'NOT_MATURE';
    pageCount?: Number;
    previewLink?: string;
    printedPageCount?: Number;
    publishedDate?: string;
    publisher?: string;
    subtitle?: string;
    title?: string;
    state?: 'READ' | 'READING' | 'READ_LATER';
}
