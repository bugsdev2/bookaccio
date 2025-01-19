import { createContext, useContext, useState } from 'react';

type SelectedBookOLProps = [Partial<OLBookDetails>, React.Dispatch<React.SetStateAction<Partial<OLBookDetails>>>];

export const SelectedBookOLContext = createContext<SelectedBookOLProps | []>([]);

const SelectedBookOLProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBookOL, setSelectedBookOL] = useState<Partial<OLBookDetails>>({});

  return <SelectedBookOLContext.Provider value={[selectedBookOL, setSelectedBookOL]}>{children}</SelectedBookOLContext.Provider>;
};

export default SelectedBookOLProvider;

export function useSelectedBookOLContext(): SelectedBookOLProps {
  const [selectedBookOL, setSelectedBookOL] = useContext(SelectedBookOLContext);

  if (selectedBookOL === undefined || setSelectedBookOL === undefined) {
    throw new Error('selectedBookOL or setSelectedBookOL is undefined');
  }

  return [selectedBookOL, setSelectedBookOL];
}
