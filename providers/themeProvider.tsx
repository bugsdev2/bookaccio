import { getData } from '@/helpers/storage';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ContextProps = [boolean, Dispatch<SetStateAction<boolean>>];

export const ThemeContext = createContext<ContextProps | []>([]);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(useColorScheme() === 'dark');

  getData('theme').then((value) => {
    if (value !== undefined) {
      setIsDarkMode(value);
    }
  });

  return <ThemeContext.Provider value={[isDarkMode, setIsDarkMode]}>{children}</ThemeContext.Provider>;
}

export function useDarkModeContext(): ContextProps {
  const [isDarkMode, setIsDarkMode] = useContext(ThemeContext);

  if (isDarkMode == undefined || setIsDarkMode == undefined) {
    throw new Error('Either isDarkMode or setIsDarkMode is undefined.');
  }

  return [isDarkMode, setIsDarkMode];
}
