export const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  let dateMSEC = Date.parse(date.toString());
  let isoDate = new Date(dateMSEC).toISOString();
  return isoDate.slice(0, isoDate.indexOf('T')).split('-').reverse().join('-');
};
