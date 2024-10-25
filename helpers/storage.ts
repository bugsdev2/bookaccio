import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getData(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        return error;
    }
}

export async function setData(key: string, value: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return 'Data Stored Successfully';
    } catch (error) {
        return error;
    }
}
