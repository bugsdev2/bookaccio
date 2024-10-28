import { setData } from './storage';

export const storeBooks = async (value: {}[]) => {
    const isCompleted = await setData('bookList', value);
    console.log('Books Stored in Database');
};
