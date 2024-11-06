import React, { createContext, useContext, useEffect, useState } from 'react';

type FullBooksListContextProps = [Book[], React.Dispatch<React.SetStateAction<Book[]>>];

const FullBooksListContext = createContext<FullBooksListContextProps | []>([]);

const FullBooksListProvider = ({ children }: { children: React.ReactNode }) => {
    const [fullBookList, setFullBookList] = useState<Book[]>([]);

    return <FullBooksListContext.Provider value={[fullBookList, setFullBookList]}>{children}</FullBooksListContext.Provider>;
};

export default FullBooksListProvider;

export const useFullBookListContext = (): FullBooksListContextProps => {
    const [fullBookList, setFullBookList] = useContext(FullBooksListContext);

    if (fullBookList === undefined || setFullBookList === undefined) {
        throw new Error('fullBookList or setFullBookList is undefined');
    }

    return [fullBookList, setFullBookList];
};
