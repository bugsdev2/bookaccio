import { setData } from './storage';

export const storeBooks = async (value: {}[]) => {
    await setData('bookList', value);
    console.log('Books Stored in Database');
};
