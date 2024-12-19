import axios from 'axios';

export const getBookDetails = async (bookTitle: string) => {
  if (bookTitle === '') return [];
  const searchTitle = bookTitle.toLowerCase().split(' ').join('+');
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${searchTitle}`;
  const res = await axios.get(URL);
  return await res.data.items;
};
