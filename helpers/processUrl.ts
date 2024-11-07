export const processUrl = (url: string | undefined) => {
    let newUrl;
    if (url) {
        newUrl = url.replace('http:', 'https:');
    }
    return newUrl;
};
