import { createContext, useContext, useState } from 'react';

type SelectedBookProps = [Partial<BookSearchResultProp>, React.Dispatch<React.SetStateAction<Partial<BookSearchResultProp>>>];

export const SelectedBookContext = createContext<SelectedBookProps | []>([]);

const SelectedBookProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBook, setSelectedBook] = useState<Partial<BookSearchResultProp>>({});

  return <SelectedBookContext.Provider value={[selectedBook, setSelectedBook]}>{children}</SelectedBookContext.Provider>;
};

export default SelectedBookProvider;

export function useSelectedBookContext(): SelectedBookProps {
  const [selectedBook, setSelectedBook] = useContext(SelectedBookContext);

  if (selectedBook === undefined || setSelectedBook === undefined) {
    throw new Error('selectedBook or setSelectedBook is undefined');
  }

  return [selectedBook, setSelectedBook];
}
