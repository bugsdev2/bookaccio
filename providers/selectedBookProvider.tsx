import { createContext, useContext, useState } from 'react';
import { blankBook } from '@/helpers/blankBookDetails';

type SelectedBookProps = [Book, React.Dispatch<React.SetStateAction<Book>>];

export const SelectedBookContext = createContext<SelectedBookProps | []>([]);

const SelectedBookProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedBook, setSelectedBook] = useState<Book>(blankBook);

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
