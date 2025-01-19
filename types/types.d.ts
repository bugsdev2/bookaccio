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
  state?: 'READ' | 'READING' | 'READ_LATER' | 'UNFINISHED';
  startDate: number;
  endDate: number;
  rating?: number;
  isbn?: string;
  notes?: string;
  review?: string;
  originalTitle?: string;
  translator?: string;
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
  state?: 'READ' | 'READING' | 'READ_LATER' | 'UNFINISHED';
  startDate?: Date;
  endDate?: Date;
  rating?: number;
  isbn?: string;
}

declare interface OLSearchResult {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OLBookSearchResults[];
  num_found: number;
  q: string;
  offset: number | null;
}

declare interface OLBookSearchResults {
  author_key: string[];
  author_name: string[] | string;
  cover_edition_key?: string;
  cover_i?: number;
  ebook_access: string;
  ebook_count_i: number;
  edition_count: number;
  edition_key: string[];
  first_publish_year?: number;
  format: string[];
  has_fulltext: boolean;
  isbn: string[];
  key: string;
  language: string[];
  last_modified_i: number;
  lcc?: string[];
  oclc?: string[];
  public_scan_b: boolean;
  publish_date: string[];
  publish_place: string[];
  publish_year: number[];
  publisher: string[];
  seed: string[];
  title: string;
  title_suggest: string;
  title_sort: string;
  type: string;
  id_amazon?: string[];
  id_goodreads?: string[];
  subject?: string[];
  place?: string[];
  readinglog_count?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;
  publisher_facet: string[];
  place_key?: string[];
  subject_facet?: string[];
  _version_: number;
  place_facet?: string[];
  lcc_sort?: string;
  author_facet: string[];
  subject_key?: string[];
  number_of_pages_median?: number;
}

declare interface OLBookDetails {
  bib_key: string;
  info_url: string;
  preview: string;
  preview_url: string;
  thumbnail_url: string;
  details: {
    publishers: string[];
    number_of_pages: number;
    description: string;
    isbn_10: string[];
    covers: number[];
    physical_format: string;
    key: string;
    subtitle: string;
    authors: {
      key: string;
      name: string;
    }[];
    ocaid: string;
    publish_places: string[];
    languages: {
      key: string;
    }[];
    pagination: string;
    classifications: Record<string, unknown>;
    source_records: string[];
    title: string;
    notes?: string;
    identifiers: {
      amazon?: string[];
      goodreads?: string[];
      librarything?: string[];
    };
    isbn_13: string[];
    edition_name?: string;
    subjects: string[];
    publish_date: string;
    publish_country: string;
    copyright_date: string;
    by_statement?: string;
    oclc_numbers: string[];
    works: {
      key: string;
    }[];
    type: {
      key: string;
    };
    local_id?: string[];
    lc_classifications?: string[];
    latest_revision: number;
    revision: number;
    created: {
      type: string;
      value: string;
    };
    last_modified: {
      type: string;
      value: string;
    };
  };
}

declare interface CryptoDetails {
  name: string;
  code: string;
  address: string;
  icon: string;
  offIcon: any;
}
