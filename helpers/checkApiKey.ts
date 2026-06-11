import axios from 'axios';

export async function checkApiKey(key: string) {
  try {
    const rawData = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=stoker&key=${key}`);
    return { data: rawData.data, headers: rawData.headers, status: rawData.status, statusText: rawData.statusText };
  } catch (err) {
    console.log(err);
    return null;
  }
}
