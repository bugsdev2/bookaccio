import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type BookSourceContextProps = [string, React.Dispatch<React.SetStateAction<string>>];

const BookSourceContext = createContext<BookSourceContextProps | []>([]);

const BookSourceProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookSource, setBookSource] = useState('google-books');

  getData('bookSource').then((data) => {
    if (data !== undefined) {
      setBookSource(data);
    }
  });

  return <BookSourceContext.Provider value={[bookSource, setBookSource]}>{children}</BookSourceContext.Provider>;
};

export default BookSourceProvider;

export const useBookSourceContext = (): BookSourceContextProps => {
  const [bookSource, setBookSource] = useContext(BookSourceContext);

  if (bookSource === undefined || setBookSource === undefined) {
    throw new Error('Custom Error: booksource or setBookSource is undefined');
  }

  return [bookSource, setBookSource];
};
