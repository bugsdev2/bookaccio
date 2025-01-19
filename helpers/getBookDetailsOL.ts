import axios from 'axios';

// for ISBN search https://openlibrary.org/api/books?bibkeys=ISBN:9780802162182&jscmd=details&format=json

export const getBookDetailsOL = async (bookTitle: string): Promise<OLSearchResult | undefined> => {
  if (bookTitle === '') return undefined;
  const searchTitle = bookTitle.toLowerCase().split(' ').join('+');
  const URL = `https://openlibrary.org/search.json?title=${searchTitle}&limit=20`;
  try {
    const res: { data: OLSearchResult } = await axios.get(URL);
    return await res.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
