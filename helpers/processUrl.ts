export const processUrl = (url: string | undefined) => {
  let newUrl;
  if (url) {
    newUrl = url.replace('http:', 'https:');
    // newUrl = newUrl.replace('-S.jpg', '-L.jpg');
  }
  return newUrl;
};
