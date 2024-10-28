import { getData } from './storage';

export const getBookList = async () => {
    try {
        const data = await getData('bookList');
        return await data;
    } catch (err) {
        return err;
    }
};
