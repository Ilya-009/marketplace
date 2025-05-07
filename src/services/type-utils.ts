export const formatDate = (date: Date, format: string = 'dd.MM.yyyy'): string => {
    if (date == null) {
        return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', String(year));
};