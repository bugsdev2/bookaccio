import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type FontsProps = [string, React.Dispatch<React.SetStateAction<string>>];

export const FontsContext = createContext<FontsProps | []>([]);

const FontsProvider = ({ children }: { children: React.ReactNode }) => {
    const [font, setFont] = useState<string>('Nunito');

    getData('font').then((value) => {
        if (value) {
            setFont(value);
        }
    });

    return <FontsContext.Provider value={[font, setFont]}>{children}</FontsContext.Provider>;
};

export function useFontsContext(): FontsProps {
    const [font, setFont] = useContext(FontsContext);

    if (font === undefined || setFont === undefined) {
        throw new Error('font or setFont is undefined');
    }

    return [font, setFont];
}

export default FontsProvider;
