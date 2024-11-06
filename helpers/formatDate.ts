export const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    let dateMSEC = Date.parse(date.toString());
    return new Date(dateMSEC).toLocaleDateString();
};
