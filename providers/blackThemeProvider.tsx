import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type BlackThemeContextProps = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

const BlackThemeContext = createContext<BlackThemeContextProps | []>([]);

const BlackThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBlackTheme, setIsBlackTheme] = useState(false);

  getData('isBlackTheme').then((data) => {
    if (data !== undefined) {
      setIsBlackTheme(data);
    }
  });

  return <BlackThemeContext.Provider value={[isBlackTheme, setIsBlackTheme]}>{children}</BlackThemeContext.Provider>;
};

export default BlackThemeProvider;

export const useBlackThemeContext = (): BlackThemeContextProps => {
  const [isBlackTheme, setIsBlackTheme] = useContext(BlackThemeContext);

  if (isBlackTheme === undefined || setIsBlackTheme === undefined) {
    throw new Error('Custom Error: isBlackTheme or setIsBlackTheme is undefiined');
  }
  return [isBlackTheme, setIsBlackTheme];
};
