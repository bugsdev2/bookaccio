import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';

type ApiKeyContextProps = [string, React.Dispatch<React.SetStateAction<string>>];

export const ApiKeyContext = createContext<ApiKeyContextProps | []>([]);

const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string>('');

  getData('apiKey').then((data) => {
    if (data !== undefined) {
      setApiKey(data);
    }
  });

  return <ApiKeyContext.Provider value={[apiKey, setApiKey]}>{children}</ApiKeyContext.Provider>;
};

export default ApiKeyProvider;

export function useApiKeyContext(): ApiKeyContextProps {
  const [apiKey, setApiKey] = useContext(ApiKeyContext);

  if (apiKey === undefined || setApiKey === undefined) {
    throw new Error('apiKey or setApiKey is not defined');
  }

  return [apiKey, setApiKey];
}
