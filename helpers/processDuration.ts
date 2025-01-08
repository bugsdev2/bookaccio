export const processDuration = (startDate: number, endDate: number) => {
  const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return 'less than a day.';
  } else if (days === 1) {
    return '1 day.';
  }
  return `${days} days`;
};
