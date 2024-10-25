import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type AccentColorProps = [string, React.Dispatch<React.SetStateAction<string>>];

export const AccentColorContext = createContext<AccentColorProps | []>([]);

const AccentColorProvider = ({ children }: { children: React.ReactNode }) => {
    const [accentColor, setAccentColor] = useState('#50a65c');
    getData('accentColor').then((value) => {
        if (value) {
            setAccentColor(value);
        }
    });

    return <AccentColorContext.Provider value={[accentColor, setAccentColor]}>{children}</AccentColorContext.Provider>;
};

export function useAccentColorContext(): AccentColorProps {
    const [accentColor, setAccentColor] = useContext(AccentColorContext);

    if (accentColor == undefined || setAccentColor == undefined) {
        throw new Error('accentColor or setAccentColor is not defined');
    }

    return [accentColor, setAccentColor];
}

export default AccentColorProvider;
