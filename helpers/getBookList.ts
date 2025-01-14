import { getData } from './storage';

export const getBookList = async (): Promise<Book[] | any> => {
  try {
    const data: Book[] = await getData('bookList');
    if (data) {
      return await data;
    } else {
      return [];
    }
  } catch (err: any) {
    return err;
  }
};
