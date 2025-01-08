declare module '*.png';

declare module 'rn-barcode-zxing-scan';

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
    industryIdentifiers: { type: string; identifier: string }[];
    pageCount: number;
  };
}

declare interface Book {
  id: number;
  currentPage: number;
  authors: string[];
  categories?: string[];
  description?: string;
  imageLinks: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    small?: string;
    smallThumbnail?: string;
    thumbnail?: string;
  };
  language?: string;
  maturityRating?: 'NOT_MATURE' | 'MATURE';
  pageCount: number;
  previewLink?: string;
  printedPageCount?: number;
  publishedDate?: string;
  publisher?: string;
  subtitle?: string;
  title?: string;
  state?: 'READ' | 'READING' | 'READ_LATER';
  startDate: number;
  endDate: number;
  rating?: number;
  isbn?: string;
}

declare interface BookOptional {
  id: number;
  currentPage?: number;
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
  language?: string;
  maturityRating?: 'NOT_MATURE' | 'MATURE';
  pageCount?: number;
  previewLink?: string;
  printedPageCount?: number;
  publishedDate?: string;
  publisher?: string;
  subtitle?: string;
  title?: string;
  state?: 'READ' | 'READING' | 'READ_LATER';
  startDate?: Date;
  endDate?: Date;
  rating?: number;
  isbn?: string;
}
