import axios from 'axios';

export async function getBookByIsbn(value: string) {
  try {
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${value}`);
    const selected: BookSearchResultProp = res.data?.items[0];
    const response = (await axios.get(selected.selfLink)).data;
    return response;
  } catch (err) {
    return undefined;
  }
}
