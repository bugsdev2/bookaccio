import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type ShowRatingContextProps = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

const ShowRatingContext = createContext<ShowRatingContextProps | []>([]);

const ShowRatingProvider = ({ children }: { children: React.ReactNode }) => {
  const [ratingShown, setRatingShown] = useState(false);

  getData('ratingShown').then((value) => {
    if (value !== undefined) {
      setRatingShown(value);
    }
  });

  return <ShowRatingContext.Provider value={[ratingShown, setRatingShown]}>{children}</ShowRatingContext.Provider>;
};

export default ShowRatingProvider;

export const useRatingShownContext = (): ShowRatingContextProps => {
  const [ratingShown, setRatingShown] = useContext(ShowRatingContext);

  if (ratingShown === undefined || setRatingShown === undefined) {
    throw new Error('Custom Error: ratingShown or setRatingShown is undefined');
  }

  return [ratingShown, setRatingShown];
};
