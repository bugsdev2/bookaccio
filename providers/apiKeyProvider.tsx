import { getData } from '@/helpers/storage';
import { Children, createContext, useContext, useState } from 'react';

type ApiKeyContextProps = [string, React.Dispatch<React.SetStateAction<string>>];

export const ApiKeyContext = createContext<ApiKeyContextProps | []>([]);

const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {};
