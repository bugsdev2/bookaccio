export const processDuration = (startDate: number, endDate: number, lessThan: string, one: string, moreThan: string) => {
  const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return lessThan;
  } else if (days === 1) {
    return one;
  }
  return `${days} ${moreThan.toLowerCase()}`;
};
