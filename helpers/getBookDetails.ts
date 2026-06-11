import axios from 'axios';

export const getBookDetails = async (bookTitle: string, apiKey: string) => {
  if (bookTitle === '') return [];
  const searchTitle = bookTitle.toLowerCase().split(' ').join('+');
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${searchTitle}&key=${apiKey}`;
  try {
    const res = await axios.get(URL);
    return await res.data.items;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
