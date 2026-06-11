import axios from 'axios';

export async function getBookByIsbn(value: string, apiKey: string): Promise<undefined | BookSearchResultProp> {
  try {
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${value}&key=${apiKey}`);
    const selected: BookSearchResultProp = res.data?.items[0];
    const response: BookSearchResultProp = (await axios.get(selected.selfLink)).data;
    return response;
  } catch (err) {
    return undefined;
  }
}
