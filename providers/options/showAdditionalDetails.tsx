import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type ShowAdditionalDetailsContextProps = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const ShowAdditionalDetailsContext = createContext<ShowAdditionalDetailsContextProps | []>([]);

const ShowAdditionalDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [additionalDetailsShown, setAdditionalDetailsShown] = useState(false);

  getData('additionalDetails').then((value) => {
    if (value !== undefined) {
      setAdditionalDetailsShown(value);
    }
  });

  return <ShowAdditionalDetailsContext.Provider value={[additionalDetailsShown, setAdditionalDetailsShown]}>{children}</ShowAdditionalDetailsContext.Provider>;
};

export default ShowAdditionalDetailsProvider;

export const useShowAdditionalDetailsContext = (): ShowAdditionalDetailsContextProps => {
  const [additionalDetailsShown, setAdditionalDetailsShown] = useContext(ShowAdditionalDetailsContext);

  if (additionalDetailsShown === undefined || setAdditionalDetailsShown === undefined) {
    throw new Error('Custom Error: additionalDetailsShown or setAdditionalDetailsShown is undefined');
  }
  return [additionalDetailsShown, setAdditionalDetailsShown];
};
