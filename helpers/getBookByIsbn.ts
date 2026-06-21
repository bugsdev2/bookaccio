import axios from 'axios';

export async function getBookByIsbn(value: string, apiKey: string): Promise<undefined | BookSearchResultProp> {
  try {
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${value.trim()}&key=${apiKey}`);
    const selected: BookSearchResultProp = res.data.items[0];
    return selected;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
